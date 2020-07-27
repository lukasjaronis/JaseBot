// Discord Role ID's for full access

// 700887245514866698 = Jase Role
// 700888529000988683 = Adminstrator Role
// 737147783768834168 = Bot Mechanic

const permissions = [
  '700887245514866698',
  '700888529000988683',
  '737147783768834168'
]

function accessCheck(message) {
  const accessCheck = message.member.roles.cache.some((role) =>
    permissions.includes(role.id)
  )
  return accessCheck
}

module.exports = accessCheck
