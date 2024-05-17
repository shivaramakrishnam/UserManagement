let show1 = false
let open = true
let url = "http://localhost:6500/users"

getUsers()
function getUsers(){
    if(show1 == false && open != true) {
        return
    }
    open = false 
    fetch(`${url}`)
        .then(resp => resp.json())
        .then(data => {
            print(data)
            console.log(data)
        })
}

function print(data){
    let tableBody = document.getElementById("table-body")
    tableBody.innerHTML = `<tbody id="table-body"></tbody>`

    let search =  document.getElementById("searchBox").value
    let mode = document.getElementById("mode").value
    data = filterDataOnSearch(data,search,mode)

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
}

function filterDataOnSearch(data,search,mode){
    if(search == "") return data;
    if(mode == "id")
        data = data.filter(user => user.id.includes(search))
    else if(mode == "name")
        data = data.filter(user => user.username.includes(search))
    else if(mode == "age")
        data = data.filter(user => user.age.toString().includes(search))
    else if(mode == "email")
        data = data.filter(user => user.email.includes(search))
    else if(mode == "all") data = data.filter(user => (user.id.includes(search) || user.username.includes(search) || user.age.toString().includes(search) || user.email.includes(search)))
    return data
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
    
    let id = document.getElementById(`userid${user.id}`).value
    let name = document.getElementById(`username${user.id}`).value
    let email = document.getElementById(`useremail${user.id}`).value
    let age = document.getElementById(`userage${user.id}`).value

    if(id == null || name == null || email == null || age == null){
        alert("Please enter all the fields!")
        return false
    }
    
    await fetch(`${url}/${user.id}`,{method:"PATCH",body : JSON.stringify({name,age,email})})
        .then(resp => resp.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))

    console.log(id,age,name,email)

    refresh()
}

async function deleteUser(id){
    console.log(id)
    await fetch(`${url}/${id}`,{method:"DELETE"})
        .then(resp => resp.json())
        .then(data => console.log(data))
    refresh()
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

    await fetch(`${url}`,{
        method : "POST",
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
        body : JSON.stringify(newUser)
    })
    .then(resp => resp.json())
    .then((data) => console.log(data))
    .catch(err => alert(err.message))

    refresh()
}

function refresh(){
    show1 = true
    getUsers()
}

async function checkUser(id,name,email,age){
    if(id == null || name == null || email == null || age == null){
        alert("Please enter all the fields!")
        return false
    }

    let flag = 0;
    await fetch(`${url}`)
        .then(resp => resp.json())
        .then(data => {
            data.forEach(user => {
                if(user.id === id && user.id != id) {
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
    await fetch(`${url}`)
        .then(resp => resp.json())
        .then(data => {
            user =  data.find(user => user.id == idn)
        })
    return user;
}

function toggleShow(){
    let show = document.getElementById("showStatus")
    if(show.innerText == "Show Users"){
        show.innerText = "Hide Users"
        show1 = false
        getUsers()
    }
    else{
        show1 = true
        show.innerText = "Show Users"
        let tbody = document.getElementById("table-body")
        tbody.innerHTML= ""
        tbody.innerHTML = `<tbody id="table-body"></tbody>`
    }
}