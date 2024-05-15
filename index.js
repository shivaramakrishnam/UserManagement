let show = true;
getUsers();

function getUsers(){

    fetch("http://localhost:3000/users")
        .then(resp => resp.json())
        .then(data => {
            let tableBody = document.getElementById("table-body")
            tableBody.innerHTML = `<tbody id="table-body"></tbody>`
            if(show == true)
                show = false
            else{
                show = true;
                return;
            }
            data.forEach((user)=>{
                let tr = document.createElement("tr")
                tr.innerHTML += `<td>${user.username}</td>`
                tr.innerHTML += `<td>${user.id}</td>`
                tr.innerHTML += `<td>${user.age}</td>`
                tr.innerHTML += `<td>${user.email}</td>`
                tr.innerHTML += `<td><button onclick="deleteUser(${user.id})">Delete</button>
                <button onclick="editUser(${tr},${})">Edit</button></td>`
                tableBody.appendChild(tr)
            })
        })
}

function deleteUser(id){
    console.log(id)
    fetch(`http://localhost:3000/users/${id}`,{method:"DELETE"})
        .then(resp => resp.json())
        .then(data => console.log(data))
}

function editUser(idn){
    
    fetch("http://localhost:3000/users/1",{method:"PATCH",body : JSON.stringify({id:idn,age:35})})
        .then(resp => resp.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
}

function addUser()
{
    let id = document.getElementById("user-id").value
    let name = document.getElementById("user-name").value
    let email = document.getElementById("user-email").value
    let age = document.getElementById("user-age").value
    addNewUser(id,name,email,age)
}

async function addNewUser(id,name,email,age){

    let newUser = {
        "id": id,
        "username": name,
        "email": email,
        "age": age,
    }
    if(id == null || name == null || email == null || age == null){
        alert("Please enter all the fields!")
        return
    }

    await fetch("http://localhost:3000/users")
        .then(resp => resp.json())
        .then(data => {
            data.forEach(user => {
                if(user.id === id) {
                    alert("User Id already exists")
                    return
                }
            });
        })

    fetch("http://localhost:3000/users",{
        method : "POST",
        body : JSON.stringify(newUser)
    })
    .then(resp => resp.json())
    .then((data) => console.log(data))
}
