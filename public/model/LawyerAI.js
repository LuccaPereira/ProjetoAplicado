
function getLawyerAi() {

    const socket = new WebSocket("ws://localhost:8000/ws"); 
    socket.onopen = () => {
    const user = JSON.parse(localStorage.getItem("loggedInLawyer"));
    socket.send(JSON.stringify({
        type: "user_data",
        data: {
        id: user.id,
        name: user.name,
        email: user.email
        }
    }));
    };
    
}