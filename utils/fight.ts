import {WarriorRecord} from "../records/warrior.record";

/*export enum LogEntryType {
   Attack,
   Defense,
   DefendBroken,
   Winner
}

 */

/*export interface LogEntry {
   text: string;
   type: LogEntryType;
}

 */
export const fight = (warrior1: WarriorRecord, warrior2: WarriorRecord): {
   log: string[];
   winner: WarriorRecord;
}=> {
   const log:string[] = [];
   const  warrior1TmpStats= {
       hp: warrior1.hardiness * 10,
      dp: warrior1.defence,
      warrior: warrior1,
   }
   const  warrior2TmpStats= {
      hp: warrior2.hardiness * 10,
      dp: warrior2.defence,
      warrior: warrior2,
   }

   let attacker = warrior1TmpStats;
   let defender = warrior2TmpStats;

   do {
      const attackStrength = attacker.warrior.power;
      log.push(`${attacker.warrior.name} zaatakuje ${defender.warrior.name} z siłą ${attackStrength}.`);
      if (defender.dp + defender.warrior.agility >attackStrength){
         log.push(`${defender.warrior.name} broni się przed ${attacker.warrior.name}.`);
         defender.dp -= attackStrength;
         if(defender.dp <0) {
            log.push(`${attacker.warrior.name} przełamał obronę ${defender.warrior.name} zadając mu ${-defender.dp} obrażeń.`);
            defender.hp += defender.dp;
         }
      } else {
         log.push(`${attacker.warrior.name} zadał ${attackStrength} obrażeń ${defender.warrior.name}.`);
         defender.hp -= attackStrength;
      }
[attacker, defender] = [defender, attacker];

   }while(defender.hp>0);
const winner = defender.warrior;

log.push(`${winner.name} zwyciężył !`)
   return {
      log,
      winner,
   };
};