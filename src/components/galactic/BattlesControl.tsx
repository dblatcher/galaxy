import { useGameStateContext } from "../../hooks/useGameStateContext"
import { BattleList } from "./BattleListings"
import { BomberListing } from "./BomberListing"
import { ModalLayout } from "../ModalLayout"


export const BattleControl = () => {
    const { activeFactionBattles, battlesWithoutActiveFaction } = useGameStateContext()

    return <ModalLayout
        title={'Battles'}
    >
        <BattleList title="Your Battles" battles={activeFactionBattles} forActivePlayer />
        <BomberListing />
        <BattleList title="Other Battles" battles={battlesWithoutActiveFaction} />
    </ModalLayout>
}