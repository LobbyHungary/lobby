client.on('voiceStateUpdate', (oldState, newState) => {
    const tempRole = oldState.guild.roles.cache.find(r => r.name === 'Ideiglenes Csatorna')
    const member = oldState.guild.members.cache.get(oldState.id)
    
    let oldChannel = oldState.channelId;
	let newChannel = newState.channelId;

	if (newChannel === null) {
        if (oldState.channel.members.first() || member.roles.cache.has(tempRole)) {
            oldState.channel.members.first().roles.add(tempRole)
        }

        member.roles.remove(tempRole)
        
	} else if (oldChannel !== null && newChannel !== null && (newChannel !== oldChannel)) {
        if (oldState.channel.members.first() || member.roles.cache.has(tempRole)) {
            oldState.channel.members.first().roles.add(tempRole)
        }
        
        member.roles.remove(tempRole)
	}
});