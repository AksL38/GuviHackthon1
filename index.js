const urlTickets = 'https://newaccount1618307298101.freshdesk.com/api/v2/tickets'
const urlContacts = 'https://newaccount1618307298101.freshdesk.com/api/v2/contacts'
const apiKey = 'XV6dk4fmIk8UNcD8rvgo:X'
const authorise = 'Basic ' + window.btoa(apiKey)
const priorities = ['None', 'Low', 'Medium', 'High', 'Urgent'];
const statuses = ['None', 'None', 'Open', 'Pending', 'Resolved', 'Closed', 'Waiting on Customer', 'Waiting on Third Party'];

document.body.classList.add('container');

//pages
let homePage = createDomElement('div', document.body, [['id', 'homePage'], ['class', 'row']]);
let listTickets = createDomElement('div', document.body, [['id', 'listTickets'], ['class', 'row'], ['style', 'visibility:collapse;']]);
let listContacts = createDomElement('div', document.body, [['id', 'listContacts'], ['class', 'row'], ['style', 'visibility:collapse;']]);
let singleContact = createDomElement('div', document.body, [['id', 'singleContact'], ['class', 'row'], ['style', 'visibility:collapse;']]);
let loading = createDomElement('div', document.body, [['class', 'row'], ['style', 'visibility:collapse;']])

//homepage
let emptyDiv = createDomElement('div', homePage, [['class', 'col-md-3']]);
let navDivTickets = createDomElement('div', homePage, [['class', 'col-md-2']]);
let tickets = createDomElement('button', navDivTickets, [['class', 'btn btn-primary']], [['onclick', renderTickets], ['textContent', 'Show tickets!']]);
let navDivContacts = createDomElement('div', homePage, [['class', 'col-md-2']]);
let contacts = createDomElement('button', navDivContacts, [['class', 'btn btn-primary']], [['onclick', renderContacts], ['textContent', 'Show contacts!']]);
let navDivAdd = createDomElement('div', homePage, [['class', 'col-md-2']]);
let addContact = createDomElement('button', navDivAdd, [['class', 'btn btn-primary']], [['onclick', () => renderContact()], ['textContent', 'Add new contact!']]);

//loading
let loaderDiv = createDomElement('div', loading, [['class',"d-flex justify-content-center"]]);
let spinnerBorder = createDomElement('div', loaderDiv, [['class',"spinner-border"], ['role',"status"]]);
createDomElement('span', spinnerBorder, [['class',"sr-only"]], [['textContent', 'Loading...']]);

//list all tickets
function renderTickets() {
    listTickets.style.visibility = 'visible';
    listContacts.style.visibility = 'collapse';
    singleContact.style.visibility = 'collapse';    
    loading.style.visibility = 'collapse';
    listAllTickets();
}


function listAllTickets() {
    while (listTickets.firstChild) {
        listTickets.removeChild(listTickets.lastChild);
    }
    let tableT = createDomElement('table', listTickets, [['class', 'table']]);
    let theadT = createDomElement('thead', tableT);
    let tHeadRowT = createDomElement('tr', theadT);
    let theadsT = ['Contact', 'Subject', 'Description', 'Priority', 'Status'];
    theadsT.forEach((val) => {
        createDomElement('th', tHeadRowT, [['scope', "col"]], [['textContent', val]]);
    })

    let tbodyT = createDomElement('tbody', tableT);
    getData(urlTickets + '?include=description')
        .then((ticketsData) => {
            ticketsData.forEach((val) => {
                let tbodyrowT = createDomElement('tr', tbodyT);
                getData(urlContacts + "/" + val.requester_id)
                    .then((data) => {
                        let rowValues = [data.name, val.subject, val.description_text];
                        rowValues.forEach((entry) => {
                            createDomElement('td', tbodyrowT, [], [['textContent', entry]]);
                        })
                        let priorityCell = createDomElement('td', tbodyrowT);
                        let prioritySelect = createDomElement('select', priorityCell, [], [['onchange', (event) => updatePriority(event, val.id)]]);
                        for (let j = 1; j < priorities.length; j++) {
                            if (j === val.priority) {
                                createDomElement('option', prioritySelect, [['selected', 'selected']], [['textContent', priorities[j]]]);
                            }
                            else {
                                createDomElement('option', prioritySelect, [], [['textContent', priorities[j]]]);
                            }
                        }
                        let statusCell = createDomElement('td', tbodyrowT);
                        let statusSelect = createDomElement('select', statusCell, [], [['onchange', (event) => updateStatus(event, val.id)]]);
                        for (let j = 2; j < statuses.length; j++) {
                            if (j === val.status) {
                                createDomElement('option', statusSelect, [['selected', 'selected']], [['textContent', statuses[j]]]);
                            }
                            else {
                                createDomElement('option', statusSelect, [], [['textContent', statuses[j]]]);
                            }
                        }
                    })
                    .catch(err => console.log(err))
            });
        })
        .catch(err => console.log(err))
}

//list all contacts
function renderContacts() {
    listContacts.style.visibility = 'visible';
    listTickets.style.visibility = 'collapse';
    singleContact.style.visibility = 'collapse';
    loading.style.visibility = 'collapse';
    listAllContacts();
}

function listAllContacts() {
    while (listContacts.firstChild) {
        listContacts.removeChild(listContacts.lastChild);
    }
    let tableC = createDomElement('table', listContacts, [['class', 'table']]);
    let theadC = createDomElement('thead', tableC);
    let tHeadRowC = createDomElement('tr', theadC);
    let theadsC = ['Contact', 'Title', 'Address', 'Email Address', 'Work Phone', 'Facebook', 'Twitter', 'Edit'];
    theadsC.forEach((val) => {
        createDomElement('th', tHeadRowC, [['scope', "col"]], [['textContent', val]]);
    })

    let tbodyC = createDomElement('tbody', tableC);
    getData(urlContacts)
        .then((contactsData) => {
            contactsData.forEach((val) => {
                let tbodyrowC = createDomElement('tr', tbodyC, [['id', val.id]]);
                let rowValues = [val.name];
                rowValues.push(val.job_title === null ? '-' : val.job_title);
                rowValues.push(val.address === null ? '-' : val.address);
                rowValues.push(val.email);
                rowValues.push(val.phone === null ? '-' : val.phone);
                rowValues.push(val.facebook_id === null ? '-' : val.facebook_id);
                rowValues.push(val.twitter_id === null ? '-' : val.twitter_id);
                rowValues.forEach((entry) => {
                    createDomElement('td', tbodyrowC, [], [['textContent', entry]]);
                })
                let editCell = createDomElement('button', tbodyrowC, [['class', 'btn btn-info btn-md']], [['onclick', () => renderContact(val.id)]]);
                createDomElement('i', editCell, [['class', "fa fa-pencil"], ['aria-hidden', "true"]]);
            });
        })
        .catch(err => console.log(err))
}

//single contact info
function renderContact(id = "") {
    listContacts.style.visibility = 'collapse';
    listTickets.style.visibility = 'collapse';
    singleContact.style.visibility = 'visible';
    loading.style.visibility = 'collapse';
    editContact(id);
}

function editContact(id = "") {
    let contactRow;
    if (id !== "") {
        contactRow = document.getElementById(id);
    }
    while (singleContact.firstChild) {
        singleContact.removeChild(singleContact.lastChild);
    }
    let form = createDomElement('form', singleContact, [], [['onsubmit', (event) => submitContact(event, id)]]);
    let formFields = [['Full Name', 'name'], ['Title', 'job_title'], ['Address', 'address'], ['Email Address', 'email'], ['Phone Number', 'phone'], ['Facebook ID', 'facebook_id'], ['Twitter ID', 'twitter_id']];
    let child = 0;
    formFields.forEach((val) => {
        let formGroup = createDomElement('div', form, [['class', 'form-group']]);
        let label = createDomElement('label', formGroup, [['for', val[1]], ['class', "col-form-label"]], [['textContent', val[0]]]);
        let input = createDomElement('input', formGroup, [['type', 'text'], ['class', 'form-control'], ['id', val[1]]]);
        if (val[1] === 'name' || val[1] === 'email') {
            input.setAttribute('required', 'required');
            if (val[1] === 'email') {
                input.setAttribute('type', 'email');
            }
        }
        if (id !== "") {
            input.value = contactRow.children[child].textContent;
        }
        child++;
    })
    createDomElement('input', form, [['type', "submit"], ['class', "btn btn-primary"], ['value', 'submit']]);

    
}

function submitContact(event, id) {
    event.preventDefault();
    let formElements = event.target.elements;
    let data = {};
    data.name = formElements.name.value;
    data.job_title = formElements.job_title.value === '-' || formElements.job_title.value === '' ? null : formElements.job_title.value;
    data.address = formElements.address.value === '-' || formElements.address.value === '' ? null : formElements.address.value;
    data.email = formElements.email.value;
    data.phone = formElements.phone.value === '-' || formElements.phone.value === ''? null : formElements.phone.value;
    //data.facebook_id = formElements.facebook_id.value === '-' || formElements.facebook_id.value === ''? null : formElements.facebook_id.value;
    data.twitter_id = formElements.twitter_id.value === '-' || formElements.twitter_id.value === ''? null : formElements.twitter_id.value;
    if (id === '') {
        postData(urlContacts, data);
    }
    else {
        updateData(urlContacts + '/' + id, data);
    }
    loading.style.visibility = 'visible';    
    singleContact.style.visibility = 'collapse';
    setTimeout(()=>renderContacts(), 5000);    
}


function updatePriority(event, id) {
    let data = {
        priority: priorities.indexOf(event.target.value)
    }
    updateData(urlTickets + '/' + id, data);
}

function updateStatus(event, id) {
    let data = {
        status: statuses.indexOf(event.target.value)
    }
    updateData(urlTickets + '/' + id, data);
}


async function getData(url) {
    try {
        let resp = await fetch(url, {
            method: 'GET',
            headers: {
                "Authorization": authorise
            }
        })
        let data = await resp.json();
        return data;
    } catch (error) {
        console.log(error)
    }
}

async function postData(url, data) {
    try {
        let resp = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json;",
                "Authorization": authorise
            }
        })
        let respData = await resp.json();
        return respData;
    } catch (error) {
        console.log(error);
    }
}

async function updateData(url, data) {
    try {
        let resp = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json;",
                "Authorization": authorise
            }
        })
        let respData = await resp.json();
        return respData;
    } catch (error) {
        console.log(error);
    }
}

async function deleteData(url) {
    try {
        let resp = await fetch(url, {
            method: 'DELETE',
            headers: {
                "Authorization": authorise
            }
        })
        let data = await resp.json();
        return data;
    } catch (error) {
        console.log(error)
    }
}

function createDomElement(elemType, parent, attributes = [], properties = []) {
    let elem = document.createElement(elemType);
    attributes.forEach(val => elem.setAttribute(val[0], val[1]));
    properties.forEach(val => elem[val[0]] = val[1]);
    return parent.appendChild(elem);
}

