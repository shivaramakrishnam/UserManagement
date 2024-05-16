let show = true;
getUsers();

function getUsers(){

    toggleShow()
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
                tr.setAttribute('data-user-id',user.id)
                tr.innerHTML += `<td>${user.username}</td>`
                tr.innerHTML += `<td>${user.id}</td>`
                tr.innerHTML += `<td>${user.age}</td>`
                tr.innerHTML += `<td>${user.email}</td>`
                tr.innerHTML += `<td><button onclick="deleteUser(${user.id})">Delete</button>
                <button onclick="showEdit(${user.id})">Edit</button></td>`
                tableBody.appendChild(tr)
            })
        })
}
    
async function showEdit(userId) {
    let tr = document.querySelector(`tr[data-user-id="${userId}"]`);
    let user = await getUserById(userId); 
    if (tr && user) {
        tr.innerHTML = "";
        tr.innerHTML += `<td><input value="${user.username}" id="username${user.id}" /></td>`;
        tr.innerHTML += `<td><input readonly="readonly" value="${user.id}" id="userid${user.id}" /></td>`;
        tr.innerHTML += `<td><input value="${user.age}" id="userage${user.id}" /></td>`;
        tr.innerHTML += `<td><input value="${user.email}" id="useremail${user.id}" /></td>`;
        tr.innerHTML += `<td><button onclick="editUser(${user.id})">Save</button>
            <button onclick="hideEdit(${user.id})">Cancel</button></td>`;
    }
}

async function hideEdit(userId) {
    let tr = document.querySelector(`tr[data-user-id="${userId}"]`);
    let user = await getUserById(userId);
    if (tr && user) {
        tr.innerHTML = ""
        tr.setAttribute('data-user-id',user.id)
        tr.innerHTML += `<td>${user.username}</td>`
        tr.innerHTML += `<td>${user.id}</td>`
        tr.innerHTML += `<td>${user.age}</td>`
        tr.innerHTML += `<td>${user.email}</td>`
        tr.innerHTML += `<td><button onclick="deleteUser(${user.id})">Delete</button>
        <button onclick="showEdit(${user.id})">Edit</button></td>`
    }
}
    

async function editUser(idn){
    let user = await getUserById(idn)
    console.log(user)
    let id = document.getElementById(`userid${user.id}`).value
    let name = document.getElementById(`username${user.id}`).value
    let email = document.getElementById(`useremail${user.id}`).value
    let age = document.getElementById(`userage${user.id}`).value

    if(!checkUser(id,name,email,age)) return

    fetch(`http://localhost:3000/users/${user.id}`,{method:"PATCH",body : JSON.stringify({age:age,name:name,email:email,id:id})})
        .then(resp => resp.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
}

async function deleteUser(id){
    console.log(id)
    await fetch(`http://localhost:3000/users/${id}`,{method:"DELETE"})
        .then(resp => resp.json())
        .then(data => console.log(data))
    show = true;
    getUsers()
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
    if(!checkUser(id,name,email,age)) return

    fetch("http://localhost:3000/users",{
        method : "POST",
        body : JSON.stringify(newUser)
    })
    .then(resp => resp.json())
    .then((data) => console.log(data))

    show = true;
    getUsers()
}

async function checkUser(id,name,email,age){
    if(id == null || name == null || email == null || age == null){
        alert("Please enter all the fields!")
        return false
    }

    let flag = 0;
    await fetch("http://localhost:3000/users")
        .then(resp => resp.json())
        .then(data => {
            data.forEach(user => {
                if(user.id === id && user.id != idn) {
                    alert("User Id already exists")
                    flag =1
                }
            });
        })
    
    if(flag == 1) return false
    return true
}

async function getUserById(idn){
    let user = null
    await fetch("http://localhost:3000/users")
        .then(resp => resp.json())
        .then(data => {
            user =  data.find(user => user.id == idn)
        })
    return user;
}

function toggleShow(){
    let show = document.getElementById("showStatus")
    if(show.textContent == "Show Users"){
        show.textContent = "Hide Users"
    }
    else show.textContent = "Show Users"
}