// Discord Role ID's for full access

// 700887245514866698 = Jase Role
// 700888529000988683 = Adminstrator Role 
// 700888657976098847 = Bot Mechanic

const permissions = ['700887245514866698', '700888529000988683', '700888657976098847']


function accessCheck(message) {
    try {
        const accessCheck = permissions.map(items => {
            // Checking if member has any of the provided roles inside the permissions array.
            if (message.member.roles.cache.has(items)) {
                console.log(items)
                return true
            } 
        })
        return accessCheck
    }
    catch (error) {
        console.log(error)
    }
}


module.exports = accessCheck