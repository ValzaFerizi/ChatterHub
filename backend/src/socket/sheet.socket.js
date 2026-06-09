const sheetService = require('../services/sheet.service')

const sheetSocket = (io, socket) => {

  socket.on('sheet:join', async (data) => {
    socket.join(`sheet:${data.sheetId}`)
    await sheetService.createSheet(data.sheetId)
    const cells = await sheetService.getAllCells(data.sheetId)
    socket.emit('sheet:data', { cells })
    io.to(`sheet:${data.sheetId}`).emit('sheet:user_joined', {
      userId: socket.id,
      username: socket.userData.username,
      sheetId: data.sheetId
    })
  })

  socket.on('cell:update', async (data) => {
    const updatedCell = await sheetService.updateCell(
      data.sheetId, data.cellId, data.value, socket.userData.username
    )
    io.to(`sheet:${data.sheetId}`).emit('cell:updated', {
      cellId: data.cellId,
      ...updatedCell
    })
  })

  socket.on('cell:editing', (data) => {
    socket.to(`sheet:${data.sheetId}`).emit('cell:being_edited', {
      cellId: data.cellId,
      editedBy: socket.userData.username,
      userId: socket.id
    })
  })

  socket.on('cell:leave', (data) => {
    socket.to(`sheet:${data.sheetId}`).emit('cell:edit_stopped', {
      cellId: data.cellId,
      userId: socket.id
    })
  })

  socket.on('sheet:leave', (data) => {
    socket.leave(`sheet:${data.sheetId}`)
    io.to(`sheet:${data.sheetId}`).emit('sheet:user_left', {
      userId: socket.id,
      username: socket.userData.username
    })
  })
}

module.exports = sheetSocket