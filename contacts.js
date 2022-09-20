const fs = require('fs/promises');
const path = require('path');

const contactsPath = path.resolve('./db/contacts.json');

async function listContacts() {
  try {
    const result = await getContacts();
    if (!result || result.length === 0) {
      return console.log('Contacts list is empty.');
    }
    console.table(result);
  } catch (error) {
    console.log(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const result = await getContacts();
    const contact = result.find(({ id }) => id === contactId);
    if (!contact) {
      return console.log('No such contact found.');
    }
    console.log('Contact details:');
    console.table(contact);
  } catch (error) {
    console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const result = await getContacts();
    const isIdExist = result.some(contact => contact.id === contactId);
    if (!isIdExist) {
      return console.log('No such contact found, nothing was removed.');
    }
    const updatedContacts = JSON.stringify(
      result.filter(({ id }) => id !== contactId),
      null,
      2
    );
    await fs.writeFile(contactsPath, updatedContacts, 'utf8');
    console.log('Contact successfully removed.');
  } catch (error) {
    console.log(error.message);
  }
}

async function addContact({ name, email, phone }) {
  try {
    const result = await getContacts();
    const isContactExist = result.some(contact => contact.name === name);
    if (isContactExist) {
      return console.log(`Contact ${name} is already in the list.`);
    }
    const id = (
      Math.max.apply(
        null,
        result.map(({ id }) => Number(id))
      ) + 1
    ).toString();
    const updatedContacts = JSON.stringify([...result, { id, name, email, phone }], null, 2);
    await fs.writeFile(contactsPath, updatedContacts, 'utf8');
    console.log('Contact successfully added:');
  } catch (error) {
    console.log(error.message);
  }
}

async function getContacts() {
  return JSON.parse(await fs.readFile(contactsPath, 'utf8'));
}

module.exports = {
  contactsPath,
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
