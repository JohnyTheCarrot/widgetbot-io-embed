import { store } from "@models"
import { Root, Tag, Avatar, MessageButton, Top, Badges, Badge, Discrim } from "./elements"
import webpCheck from '@ui/shared/webpCheck'
import { gifCheck } from "@ui/Message"
import { generalStore } from "@store"
import { NavLink } from "react-router-dom"
import { tags } from "@ui/Message/Author"
import Tooltip from "rc-tooltip"

// badges
import staff from '@images/discordAssets/48d5bdcffe9e7848067c2e187f1ef951.svg'
import partner from '@images/discordAssets/34306011e46e87f8ef25f3415d3b99ca.svg'
import certifiedMod from '@images/discordAssets/c981e58b5ea4b7fedd3a643cf0c60564.svg'
import hypesquadEvents from '@images/discordAssets/e666a84a7a5ea2abbbfa73adf22e627b.svg'
import bravery from '@images/discordAssets/efcc751513ec434ea4275ecda4f61136.svg'
import brilliance from '@images/discordAssets/ec8e92568a7c8f19a052ef42f862ff18.svg'
import balance from '@images/discordAssets/9f00b18e292e10fc0ae84ff5332e8b0b.svg'
import bugHunter1 from '@images/discordAssets/8353d89b529e13365c415aef08d1d1f4.svg'
import bugHunter2 from '@images/discordAssets/f599063762165e0d23e8b11b684765a8.svg'
import earlyVerifiedBotDev from '@images/discordAssets/4441e07fe0f46b3cb41b79366236fca6.svg'
import earlySupporter from '@images/discordAssets/b802e9af134ff492276d94220e36ec5c.svg'

const Profile = () => (
    <Root x={store.modal.x} y={store.modal.y}>
        <Top>
            <Avatar height={92} width={92} src={webpCheck(gifCheck(store.modal.avatarUrl))} />
            <Badges>
                {store.modal.flags & 1 << 0 ? <Tooltip overlay="Discord Staff" placement="top"><Badge src={staff} /></Tooltip> : null}
                {store.modal.flags & 1 << 1 ? <Tooltip overlay="Partnered Server Owner" placement="top"><Badge src={partner} /></Tooltip> : null}
                {store.modal.flags & 1 << 18 ? <Tooltip overlay="Discord Certified Moderator" placement="top"><Badge src={certifiedMod} /></Tooltip> : null}
                {store.modal.flags & 1 << 2 ? <Tooltip overlay="HypeSquad Events" placement="top"><Badge src={hypesquadEvents} /></Tooltip> : null}
                {store.modal.flags & 1 << 6 ? <Tooltip overlay="HypeSquad Bravery" placement="top"><Badge src={bravery} /></Tooltip> : null}
                {store.modal.flags & 1 << 7 ? <Tooltip overlay="HypeSquad Brilliance" placement="top"><Badge src={brilliance} /></Tooltip> : null}
                {store.modal.flags & 1 << 8 ? <Tooltip overlay="HypeSquad Balance" placement="top"><Badge src={balance} /></Tooltip> : null}
                {store.modal.flags & 1 << 3 ? <Tooltip overlay="Discord Bug Hunter" placement="top"><Badge src={bugHunter1} /></Tooltip> : null}
                {store.modal.flags & 1 << 14 ? <Tooltip overlay="Discord Bug Hunter" placement="top"><Badge src={bugHunter2} /></Tooltip> : null}
                {store.modal.flags & 1 << 17 ? <Tooltip overlay="Early Verified Bot Developer" placement="top"><Badge src={earlyVerifiedBotDev} /></Tooltip> : null}
                {store.modal.flags & 1 << 9 ? <Tooltip overlay="Early Supporter" placement="top"><Badge src={earlySupporter} /></Tooltip> : null}
            </Badges>
        </Top>
        <Tag>
            {store.modal.username}
            {store.modal.discrim !== '0000' ? <Discrim>#{store.modal.discrim}</Discrim> : null}
            {tags({ author: store.modal, guest: store.modal.guest })}
        </Tag>
        {generalStore.settings?.directEnabled && !store.modal.bot && <NavLink
            to={`./@${store.modal.id}`}
            children={<MessageButton variant="large" onClick={() => store.modal.close()}>Message @{store.modal.username}</MessageButton>}
        />}

        <style>{`
            .modal {
                background: none;
            }
        `}</style>
    </Root>
)

export default Profile
