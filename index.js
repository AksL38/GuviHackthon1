const urlTickets = 'https://newaccount1618307298101.freshdesk.com/api/v2/tickets'
const urlContacts = 'https://newaccount1618307298101.freshdesk.com/api/v2/contacts'
const apiKey = 'XV6dk4fmIk8UNcD8rvgo:X'
const authorise = 'Basic ' + window.btoa(apiKey)
const priorities = ['None', 'Low', 'Medium', 'High', 'Urgent'];
const statuses = ['None', 'None', 'Open', 'Pending', 'Resolved', 'Closed', 'Waiting on Customer', 'Waiting on Third Party'];

document.body.classList.add('container');
document.body.style.padding = '5px';
document.body.style.maxWidth = '100vw';
let main = createDomElement('div', document.body, [['class', 'row']]);
let sidebar = createDomElement('div', main, [['class', 'col-1'], ['style', 'height:100vh; background:black']]);
let content = createDomElement('div', main, [['class', 'col-11'], ['style', 'background:gray']])

//sidebar
let ul = createDomElement('ul', sidebar, [['class', 'nav nav-pills flex-column']]);
let homeItem = createDomElement('li', ul, [['class', 'nav-item']]);
let homeLink = createDomElement('a', homeItem, [['class', 'nav-link current'], ['href', '#homePage'], ['style', 'color:#FFFFFF']], [['onclick', () => renderHomePage()], ['textContent', 'DASHBOARD']]);
let ticketsItem = createDomElement('li', ul, [['class', 'nav-item']]);
let ticketsLink = createDomElement('a', ticketsItem, [['class', 'nav-link'], ['href', '#listTickets'], ['style', 'color:#FFFFFF']], [['onclick', () => renderTickets()], ['textContent', 'TICKETS']]);
let contactsItem = createDomElement('li', ul, [['class', 'nav-item']]);
let contactsLink = createDomElement('a', contactsItem, [['class', 'nav-link'], ['href', '#listContacts'], ['style', 'color:#FFFFFF']], [['onclick', () => renderContacts()], ['textContent', 'CONTACTS']]);
let addContactItem = createDomElement('li', ul, [['class', 'nav-item']]);
let addContactLink = createDomElement('a', addContactItem, [['class', 'nav-link'], ['href', '#singleContact'], ['style', 'color:#FFFFFF']], [['onclick', () => renderContact()], ['textContent', 'ADD CONTACT']]);

//content
let homePage = createDomElement('div', content, [['id', 'homePage'], ['class', 'row']]);
let listTickets = createDomElement('div', content, [['id', 'listTickets'], ['class', 'row'], ['style', 'display:none;']]);
let listContacts = createDomElement('div', content, [['id', 'listContacts'], ['class', 'row'], ['style', 'display:none;']]);
let singleContact = createDomElement('div', content, [['id', 'singleContact'], ['class', 'row'], ['style', 'display:none;']]);
let loading = createDomElement('div', content, [['class', 'row'], ['style', 'display:none;']])

renderHomePage();

//homepage
function renderHomePage() {
    listTickets.style.display = 'none';
    ticketsLink.classList.remove('current');
    listContacts.style.display = 'none';
    contactsLink.classList.remove('current');
    singleContact.style.display = 'none';
    addContactLink.classList.remove('current');
    loading.style.display = 'none';
    homePage.style.display = 'flex';
    homeLink.classList.add('current');
    displayHomePage();
}

function displayHomePage() {
    while(homePage.firstChild) {
        homePage.removeChild(homePage.lastChild);
    }
    getData(urlTickets + '?include=description')
        .then((data) => {
            let unresolved = data.filter((val) => val.status !== 5);
            let open = data.filter((val) => val.status === 2);
            let overdue = data.filter((val) => {
                let dueDate = new Date(val.due_by);
                let currentDate = new Date();
                return dueDate.getTime() < currentDate.getTime() && val.status === 2;
            });
            let onHold = data.filter((val) => val.status === 3 || val.status === 6 || val.status === 7);
            let col1 = createDomElement('div', homePage, [['class', 'col-6 p-5']]);
            createDomElement('div', col1, [['class', 'card text-primary'], ['style', 'font-size:xx-large;text-align:center;background:#f5f7f9;']],
                [['innerHTML', '<p>Unresolved</p><p>' + unresolved.length + '</p>'], ['onclick', () => renderTickets(unresolved, ' Unresolved')]]);
            let col2 = createDomElement('div', homePage, [['class', 'col-6  p-5']]);
            createDomElement('div', col2, [['class', 'card text-info'], ['style', 'font-size:xx-large;text-align:center;background:#f5f7f9;']],
             [['innerHTML', '<p>Open</p><p>' + open.length + '</p>'], ['onclick', () => renderTickets(open, ' Open')]]);
            let col3 = createDomElement('div', homePage, [['class', 'col-6 p-5']]);
            createDomElement('div', col3, [['class', 'card text-danger'], ['style', 'font-size:xx-large;text-align:center;background:#f5f7f9;']],
             [['innerHTML', '<p>Overdue</p><p>' + overdue.length + '</p>'], ['onclick', () => renderTickets(overdue, ' Overdue')]]);
            let col4 = createDomElement('div', homePage, [['class', 'col-6 p-5']]);
            createDomElement('div', col4, [['class', 'card text-warning'], ['style', 'font-size:xx-large;text-align:center;background:#f5f7f9;']],
             [['innerHTML', '<p>On Hold</p><p>' + onHold.length + '</p>'], ['onclick', () => renderTickets(onHold, ' On Hold')]]);

        })
        .catch((err) => console.log(err))
}
// let emptyDiv = createDomElement('div', homePage, [['class', 'col-md-3']]);
// let navDivTickets = createDomElement('div', homePage, [['class', 'col-md-2']]);
// let tickets = createDomElement('button', navDivTickets, [['class', 'btn btn-primary']], [['onclick', renderTickets], ['textContent', 'Show tickets!']]);
// let navDivContacts = createDomElement('div', homePage, [['class', 'col-md-2']]);
// let contacts = createDomElement('button', navDivContacts, [['class', 'btn btn-primary']], [['onclick', renderContacts], ['textContent', 'Show contacts!']]);
// let navDivAdd = createDomElement('div', homePage, [['class', 'col-md-2']]);
// let addContact = createDomElement('button', navDivAdd, [['class', 'btn btn-primary']], [['onclick', () => renderContact()], ['textContent', 'Add new contact!']]);

//loading
let loaderDiv = createDomElement('div', loading, [['class', "d-flex justify-content-center"], ['style', 'height:50vh']]);
let spinnerBorder = createDomElement('div', loaderDiv, [['class', "spinner-border"], ['role', "status"]]);
createDomElement('span', spinnerBorder, [['class', "sr-only"]], [['textContent', 'Loading...']]);

//list all tickets
function renderTickets(data = null, filterName = '') {
    listTickets.style.display = 'contents';
    ticketsLink.classList.add('current');
    listContacts.style.display = 'none';
    contactsLink.classList.remove('current');
    singleContact.style.display = 'none';
    addContactLink.classList.remove('current');
    loading.style.display = 'none';
    homePage.style.display = 'none';
    homeLink.classList.remove('current');
    listAllTickets(data, filterName);
}


function listAllTickets(data = null, filterName = '') {
    while (listTickets.firstChild) {
        listTickets.removeChild(listTickets.lastChild);
    }
    if (data === null) {
        createDomElement('p', listTickets, [['class', 'col-12']], [['textContent', 'All Tickets:']])
        getData(urlTickets + '?include=description')
            .then((ticketsData) => {
                processTicketsData(ticketsData);
            })
            .catch(err => console.log(err))
    }
    else {
        createDomElement('p', listTickets, [['class', 'col-12']], [['textContent', 'Tickets filtered by: ' + filterName]])
        processTicketsData(data);
    }
}

function processTicketsData(ticketsData) {
    let tableT = createDomElement('table', listTickets, [['class', 'table']]);
    let theadT = createDomElement('thead', tableT);
    let tHeadRowT = createDomElement('tr', theadT);
    let theadsT = ['Contact', 'Subject', 'Description', 'Priority', 'Status'];
    theadsT.forEach((val) => {
        createDomElement('th', tHeadRowT, [['scope', "col"]], [['textContent', val]]);
    })

    let tbodyT = createDomElement('tbody', tableT);
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
}

//list all contacts
function renderContacts() {
    listContacts.style.display = 'contents';
    listTickets.style.display = 'none';
    singleContact.style.display = 'none';
    loading.style.display = 'none';
    ticketsLink.classList.remove('current');
    contactsLink.classList.add('current');
    addContactLink.classList.remove('current');    
    homePage.style.display = 'none';
    homeLink.classList.remove('current');
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
    listContacts.style.display = 'none';
    listTickets.style.display = 'none';
    singleContact.style.display = 'contents';
    loading.style.display = 'none';
    ticketsLink.classList.remove('current');
    contactsLink.classList.remove('current');
    addContactLink.classList.add('current');
    homePage.style.display = 'none';
    homeLink.classList.remove('current');
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
    data.phone = formElements.phone.value === '-' || formElements.phone.value === '' ? null : formElements.phone.value;
    //data.facebook_id = formElements.facebook_id.value === '-' || formElements.facebook_id.value === ''? null : formElements.facebook_id.value;
    data.twitter_id = formElements.twitter_id.value === '-' || formElements.twitter_id.value === '' ? null : formElements.twitter_id.value;
    if (id === '') {
        postData(urlContacts, data);
    }
    else {
        updateData(urlContacts + '/' + id, data);
    }
    loading.style.display = 'contents';
    singleContact.style.display = 'none';
    setTimeout(() => renderContacts(), 5000);
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

