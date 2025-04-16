import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔑 Replace these with your actual Supabase info:
const supabaseUrl = 'https://weckyfibrxomffyvadlz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlY2t5ZmlicnhvbWZmeXZhZGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3OTAxMjgsImV4cCI6MjA2MDM2NjEyOH0.6Lngq_kzSpkcu5bTs75tElvCfQYw9p_FXadAqONeavY'

const supabase = createClient(supabaseUrl, supabaseKey)

// 👉 Call function to load products on page load
loadProducts()

async function loadProducts() {
  const { data, error } = await supabase.from('products').select('*')
  if (error) {
    console.error('Error loading products:', error)
    return
  }

  // Display products in the HTML
  const container = document.getElementById('products')
  container.innerHTML = '<h3>Products:</h3>' + data.map(p => `
    <div>
      <strong>${p.name}</strong> - ₹${p.price} - Qty: ${p.quantity}
    </div>
  `).join('')
}
// Show login box when "Login" button clicked
document.getElementById('login-btn').addEventListener('click', () => {
    document.getElementById('login-box').style.display = 'block'
  })
  
  // Login function for admin
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
    showAdminTools() // next step
  }
  