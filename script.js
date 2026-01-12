// Particle Animation
const canvas = document.getElementById("particleCanvas")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let particles = []
const mouse = { x: null, y: null, radius: 150 }

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 3 + 1
    this.speedX = Math.random() * 1 - 0.5
    this.speedY = Math.random() * 1 - 0.5
    this.opacity = Math.random() * 0.5 + 0.2
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY

    // Hover effect
    if (mouse.x != null && mouse.y != null) {
      const dx = mouse.x - this.x
      const dy = mouse.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius
        const angle = Math.atan2(dy, dx)
        this.x -= Math.cos(angle) * force * 5
        this.y -= Math.sin(angle) * force * 5
      }
    }

    // Bounce off edges
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
  }

  draw() {
    const isDarkMode = document.body.classList.contains("dark-mode")
    const baseOpacity = isDarkMode ? 0.6 : 0.3

    ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity * baseOpacity})`
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

function init() {
  particles = []
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle())
  }
}

function connect() {
  const isDarkMode = document.body.classList.contains("dark-mode")
  const maxDistance = 150

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < maxDistance) {
        const opacity = (1 - distance / maxDistance) * (isDarkMode ? 0.3 : 0.15)
        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < particles.length; i++) {
    particles[i].update()
    particles[i].draw()
  }

  connect()
  requestAnimationFrame(animate)
}

// Mouse move event
window.addEventListener("mousemove", (e) => {
  mouse.x = e.x
  mouse.y = e.y
})

window.addEventListener("mouseout", () => {
  mouse.x = null
  mouse.y = null
})

// Resize canvas
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  init()
})

// Theme toggle
const themeToggle = document.getElementById("themeToggle")

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode")

  // Save preference
  const isDarkMode = document.body.classList.contains("dark-mode")
  localStorage.setItem("theme", isDarkMode ? "dark" : "light")
})

// Load theme preference
const savedTheme = localStorage.getItem("theme")
if (savedTheme === "light") {
  document.body.classList.remove("dark-mode")
}

// Smooth scroll for navigation
document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    target.scrollIntoView({ behavior: "smooth", block: "start" })
  })
})

// Form submission
const contactForm = document.querySelector(".contact-form")
contactForm.addEventListener("submit", (e) => {
  e.preventDefault()
  alert("Thank you for your message! I will get back to you soon.")
  contactForm.reset()
})

// Initialize
init()
animate()
