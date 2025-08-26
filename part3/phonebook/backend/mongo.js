const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(process.argv.length)

  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.jtp88tu.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Phone = mongoose.model('Phone', phoneSchema)

if (process.argv.length === 5) {
  const phone = new Phone({
    name: process.argv[3],
    number: process.argv[4]
  })

  phone.save().then(() => {
    console.log('phone saved!')
    mongoose.connection.close()
  })
} else {
  Phone.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(phone => {
      console.log(phone.name, phone.number)
    })
    mongoose.connection.close()
  })
}