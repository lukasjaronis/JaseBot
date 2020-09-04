
// Discord Role ID's for full access

// 700887245514866698 = Jase Role
// 751238703485157438 = Adminstrator Role+
// 700888529000988683 = Adminstrator
// 737147783768834168 = Ricks Mechanic

const permissions = [
  '700887245514866698',
  '751238703485157438',
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