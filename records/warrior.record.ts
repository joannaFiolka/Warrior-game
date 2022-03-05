import {ValidationError} from "../utils/errors";
import {v4 as uuid} from "uuid";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type WarriorRecordResult = [WarriorRecord[], FieldPacket[]];

 export class WarriorRecord {
    id ?: string;
    readonly name: string;
    readonly power: number;
    readonly defence: number;
    readonly hardiness: number;
    readonly agility: number;
    wins?: number;
    constructor(obj: Omit<WarriorRecord, 'insert'| 'update'>) {
        const {id, name, power, defence, hardiness, agility, wins} = obj;
        const stats = [power, defence, hardiness, agility];
        const sum = [power, defence, hardiness, agility].reduce((prev:number, curr:number) => prev + curr,0);

        for (const stat of stats){
            if(stat<1){
                throw new ValidationError(`Każda ze statystyk musi wynosić min.1.Ustaw poprawną wartość.`);
            }
        }
        if (sum !==10){
            throw new ValidationError(`Suma wszstkich satystych musi wynosić 10 obecnie jest to ${sum}.`);
        }

        this.id = id ?? uuid();
        this.wins = wins ?? 0;
        this.name = name;
        this.power = power;
        this.defence = defence;
        this.hardiness = hardiness;
        this.agility = agility;
    }

    async insert(): Promise<string> {

        await pool.execute("INSERT INTO `warrior`(`id`, `name`,`power`, `defence`,`hardiness`,`agility`, `wins`) VALUES(:id, :name, :power, :defence, :hardiness, :agility, :wins)", {
            id: this.id,
            name: this.name,
            power: this.power,
            defence: this.defence,
            hardiness: this.hardiness,
            agility: this.agility,
            wins: this.wins,
        });

        return this.id;
    }

    async update(): Promise<void> {
        await pool.execute("UPDATE `warrior` SET `wins` = :wins WHERE id= :id",{
            id: this.id,
            wins: this.wins,
        });
    }

    static async listAll():Promise<WarriorRecord[]> {
        const [results] = (await pool.execute("SELECT * FROM `warrior` ORDER BY `name` ASC")) as WarriorRecordResult;
        return results.map(obj => new WarriorRecord(obj));
    }

    static async getOne(id:string):Promise<WarriorRecord|null> {
        const [results] = await pool.execute("SELECT * FROM `warrior` WHERE `id` = :id", {
            id,
        }) as WarriorRecordResult;
        return results.length === 0 ? null : new WarriorRecord(results[0]);
    }
static async listTop(topCount :number):Promise<WarriorRecord[]>{
    const [results] = (await pool.execute("SELECT * FROM `warrior` ORDER BY `wins` DESC LIMIT :topCount",{
        topCount,
    })) as WarriorRecordResult;
    return results.map(obj => new WarriorRecord(obj));
}
static async inNameTaken(name:string): Promise<boolean>{
    const [results] = (await pool.execute("SELECT * FROM `warrior` WHERE `name`= :name ",{
       name,
    })) as WarriorRecordResult;
    return results.length>0;
}
}

