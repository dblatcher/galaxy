import { BattleListings } from "./BattleListings"
import { ModalLayout } from "./ModalLayout"


export const BattleControl = () => {

    return <ModalLayout 
        title={'Battles'}
    >
        <BattleListings />
    </ModalLayout>
}