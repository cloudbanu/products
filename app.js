import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase config
const supabaseUrl = 'https://weckyfibrxomffyvadlz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlY2t5ZmlicnhvbWZmeXZhZGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3OTAxMjgsImV4cCI6MjA2MDM2NjEyOH0.6Lngq_kzSpkcu5bTs75tElvCfQYw9p_FXadAqONeavY'

const supabase = createClient(supabaseUrl, supabaseKey)

let isAdmin = false

loadProducts()

// Load product list
async function loadProducts() {
  const { data, error } = await supabase.from('products').select('*')
  if (error) {
    console.error('Error loading products:', error)
    return
  }

  const container = document.getElementById('products')
  container.innerHTML = '<h3>Products:</h3>' + data.map(p => `
    <div>
      <strong>${p.name}</strong> - ₹${p.price} - Qty: ${p.quantity}
      ${isAdmin ? `
        <button onclick="editProduct(${p.id}, '${p.name}', ${p.price}, ${p.quantity})">Edit</button>
        <button onclick="deleteProduct(${p.id})">Delete</button>
      ` : ''}
    </div>
  `).join('')

  if (isAdmin) {
    container.innerHTML += `
      <h3>Add Product:</h3>
      <input id="new-name" placeholder="Name" />
      <input id="new-price" placeholder="Price" type="number" />
      <input id="new-qty" placeholder="Qty" type="number" />
      <button onclick="addProduct()">Add</button>
    `
  }
}

// Login box button
document.getElementById('login-btn').addEventListener('click', () => {
  document.getElementById('login-box').style.display = 'block'
})

// Login
async function login() {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    alert('Login failed: ' + error.message)
    return
  }

  alert('Logged in as Admin! 🥳')
  isAdmin = true
  document.getElementById('login-box').style.display = 'none'
  loadProducts()
}

window.login = login // needed so HTML can see it
window.addProduct = addProduct
window.editProduct = editProduct
window.deleteProduct = deleteProduct

// Add product
async function addProduct() {
  const name = document.getElementById('new-name').value
  const price = Number(document.getElementById('new-price').value)
  const quantity = Number(document.getElementById('new-qty').value)

  if (!name || !price || !quantity) return alert('Please fill all fields')

  const { error } = await supabase.from('products').insert([{ name, price, quantity }])
  if (error) return alert('Error adding: ' + error.message)

  loadProducts()
}

// Edit product (simple prompt)
async function editProduct(id, name, price, quantity) {
  const newName = prompt('Name:', name)
  const newPrice = prompt('Price:', price)
  const newQty = prompt('Quantity:', quantity)

  const { error } = await supabase.from('products').update({
    name: newName,
    price: Number(newPrice),
    quantity: Number(newQty)
  }).eq('id', id)

  if (error) return alert('Error updating: ' + error.message)

  loadProducts()
}

// Delete product
async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return alert('Error deleting: ' + error.message)

  loadProducts()
}

document.getElementById('submit-login').addEventListener('click', login)
