/* global io jQuery */
var socket = io();


jQuery('#select').change(selectRoom);

socket.on('connect', () => {
    console.log("connected to socket chat server");
    socket.emit('joinIndex');
});

socket.on('disconnect', () => {
  console.log('disconnected from socket chat server');
});

socket.on('updateRoomList', function (roomNames) {
  var select = jQuery('#select').detach()
  var last = select.children().last().detach()

  roomNames.forEach((name) => {
    var option = jQuery('<option></option>').text(name)
    select.append(option)
  })
  select.append(last)

  jQuery('#select-field').append(select)
})

function selectRoom () {
  console.log('selectRoom')
  var input = jQuery('#input')
  var select = jQuery('#select')
  var text = select.find('option:selected').text()

  if (text === 'Create new room') {
    jQuery('#input-field').show()
    input.val('').focus()
  } else {
    jQuery('#input-field').hide()
    input.val(text)
  }
}