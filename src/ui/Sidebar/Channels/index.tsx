import {Route} from "react-router-dom";
import {Query} from "react-apollo";
import {Channels, ChannelsVariables} from "@generated";
import {observer} from "mobx-react";


import {Root} from "./elements";
import Category from "./Category";
import categorise from "./categorise";
import CHANNELS from "./Channels.graphql";
import {generalStore} from "@store";

export const ITEM_ID = 'channel';

export const ChannelSwitcher = observer(({visible}) => visible ? (
	<Route path="/:guild/:channel?">
		{({
			  match: {
				  params: {guild, channel}
			  }
		  }) => {
			return (
				<Root className="channels">
					{ // if there are no channels in generalStore, do a Channels query to avoid empty channel list
					(generalStore.channels.length === 0) ? (
					<Query<Channels, ChannelsVariables>
						key={`guild_info:${guild}`}
						query={CHANNELS}
						variables={{guild}}
						fetchPolicy='cache-and-network'
					>
						{({data}) => {
							try {
								generalStore.setChannels(categorise((data.guild.channels as any).sort((a, b) => { return a.position - b.position })))
							} catch (_) {
								generalStore.setChannels([])
							}

							return generalStore.channels.map((category, i) => (
								<Category key={i} category={category} activeChannel={channel} index={i}/>
							)
						)
						}}
					</Query>
					// otherwise, just load from generalStore; channels will be updated by the GuildInfo query
					) : generalStore.channels.map((category, i) => (
						<Category key={i} category={category} activeChannel={channel} index={i}/>
					))}
				</Root>
			)
		}}
	</Route>
) : null);


export default ChannelSwitcher
