import {Router} from "express";
import {WarriorRecord} from "../records/warrior.record";
import {ValidationError} from "../utils/errors";
import {fight} from "../utils/fight";

//import {ValidationError} from "../utils/errors";


export const arenaRouter = Router();

arenaRouter

    .get('/fight-form', async (req, res) => {

        const warriors = await WarriorRecord.listAll();
        res.render('arena/fight-form', {
            warriors,
        });

    })
    .post('/fight', async(req, res)=>{
       const {warrior1: warrior1TmpStats, warrior2: warrior2TmpStats} = req.body;
       if(warrior1TmpStats===warrior2TmpStats){
           throw new ValidationError(`Proszę wybrać dwóch różnych przeciwników`)
       }
        const warrior1 = await WarriorRecord.getOne(warrior1TmpStats);
        const warrior2 = await WarriorRecord.getOne(warrior2TmpStats);
        if(!warrior1){
            
            throw new ValidationError(`Nie znalexiono przeciwnika nr 1.`)
        }
        if(!warrior2){
            throw new ValidationError(`Nie znalexiono przeciwnika nr 2.`)
        }
       const {log, winner} = fight( warrior1, warrior2);
        winner.wins++;
        await winner.update();
        res.render('arena/fight',{
        log,
        });
    })
