import CreatureList from './creatures'
import EquipList from './equip'
//import ItemList from './items'
import Materials from './materials'
import Entity from './entity'
import { EquipTypes } from './equipslots';



export function buildEquip(buildID, matID = null) {
    let baseOpts = EquipList[buildID]
    if (!baseOpts) {
        throw new Error(`BuildID ${buildID} does not exist in equip list.`)
    }
    if (baseOpts.material) {
        if (!matID) {
            throw new Error(`BuildID ${buildID} must be made of a material.`)
        }
        let mat = Materials[matID]
        if (!mat) {
            throw new Error(`Material ID ${matID} doesn't exist in material list.`)
        }
        baseOpts.name = baseOpts.name.replace('<material>', mat.name)
        baseOpts.desc = baseOpts.desc.replace('<material>', mat.name)
        let matStats = mat[baseOpts.equipType]
        if (matStats) {
            Object.keys(matStats).forEach(stat => {
                baseOpts[stat] = (baseOpts[stat] || 0) + matStats[stat]
            })
        }
        baseOpts.color = mat.color
        baseOpts.hardness = mat.hardness
    }
    return new Entity(baseOpts)
}