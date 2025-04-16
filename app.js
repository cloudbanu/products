import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase connection
const supabaseUrl = 'https://weckyfibrxomffyvadlz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlY2t5ZmlicnhvbWZmeXZhZGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3OTAxMjgsImV4cCI6MjA2MDM2NjEyOH0.6Lngq_kzSpkcu5bTs75tElvCfQYw9p_FXadAqONeavY'

const supabase = createClient(supabaseUrl, supabaseKey)

// Load products on page load
loadProducts()

// 🔄 Load product list
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
    </div>
  `).join('')
}

// 👇 Show login box when button clicked
document.getElementById('login-btn').addEventListener('click', () => {
  document.getElementById('login-box').style.display = 'block'
})

// 🔐 Login function
async function login() {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    alert('Login failed: ' + error.message)
    return
  }

  alert('Logged in as Admin!')
  document.getElementById('login-box').style.display = 'none'
  showAdminTools() // Next step
}

// 🔧 Placeholder for admin tools
function showAdminTools() {
  const container = document.getElementById('products')
  container.innerHTML += `<p style="color:green">🛠️ Admin features coming next!</p>`
}
