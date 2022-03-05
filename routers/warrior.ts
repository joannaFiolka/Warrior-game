import {Router} from "express";
import {WarriorRecord} from "../records/warrior.record";
import {ValidationError} from "../utils/errors";

//import {ValidationError} from "../utils/errors";


export const warriorRouter = Router();

warriorRouter

    .get('/add-form', (req, res) => {
       res.render('warrior/add-form');

        })
    .post('/', async(req, res)=>{

         const {power, defence, hardiness, agility} = req.body;
           if(await WarriorRecord.inNameTaken(req.body.name)){
               throw new ValidationError(`Nazwa wojownika ${req.body.name} jest zajęte. Wybierz inną.`)
           }

            const warrior = new WarriorRecord({
                ...req.body,
                power: Number(power),
                defence: Number(defence),
                hardiness: Number(hardiness),
                agility: Number(agility),

            });
            const id = await warrior.insert();
            res.render('warrior/warrior-added', {
                id,
                name: warrior.name,
            })
});
