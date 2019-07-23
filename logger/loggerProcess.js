const containerMessage = document.getElementById("containerMessage");
const spanMessage = containerMessage.children[0];
switch(messageData){
    case 0:
        containerMessage.parentNode.removeChild(containerMessage);
        break;
    case 1:
        spanMessage.innerText = "Invalid Username or Password";
        break;
    case 2:
        spanMessage.innerText = "Bad Query!";
        break;
}