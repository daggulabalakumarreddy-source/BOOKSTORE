// Main configuration and global logic

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      // Very basic mobile toggle by injecting display style 
      // (in production, a CSS class toggle is better)
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.backgroundColor = 'var(--color-primary)';
        navLinks.style.padding = '20px';
      }
    });

    // Reset styles on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'row';
        navLinks.style.position = 'static';
        navLinks.style.padding = '0';
      } else {
        navLinks.style.display = 'none';
      }
    });
  }

  // Sticky Navbar Shrink
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Scroll Reveal Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // User Avatar Initialization
  const currentUserStr = localStorage.getItem('bookstore_current_user');
  if (currentUserStr) {
    const user = JSON.parse(currentUserStr);
    const avatarInitialStr = user.name ? user.name.charAt(0).toUpperCase() : 'U';
    
    const initialEl = document.getElementById('avatar-initial');
    if (initialEl) {
      initialEl.textContent = avatarInitialStr;
    }
  }
});
