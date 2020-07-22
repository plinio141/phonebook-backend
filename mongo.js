const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
console.log(process.argv[2]);

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-weose.mongodb.net/phonebook?retryWrites=true&w=majority`


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
    Person.find().then((people)=> {
        console.log('phonebook:');
        people.forEach(person => {
            console.log(`${person.name} ${person.number}`)
          })
        mongoose.connection.close()
    }).catch(err => {
        console.log(err);
    });
} else {
    const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });
    newPerson.save()
        .then(person => {
            console.log(`added ${person.number} ${person.number} to phonebook`);
            mongoose.connection.close()
        })
}
