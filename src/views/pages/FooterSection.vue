<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="col about">
        <h3>CarDeal</h3>
        <p>Trusted dealership network — reserve online, test drive at your preferred dealer.</p>
        <div class="socials">
          <a aria-label="Facebook" href="https://web.facebook.com" class="soc"><i class="fab fa-facebook-f"></i></a>
          <a aria-label="Instagram" href="https://www.instagram.com" class="soc"><i class="fab fa-instagram"></i></a>
          <a aria-label="Youtube" href="https://www.youtube.com" class="soc"><i class="fab fa-youtube"></i></a>
        </div>
      </div>

      <div class="col links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/cars-page">Cars</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/google-form">Feedback</a></li>

          <!-- 🔥 Updated: Contact now goes to the new Contact page -->
          <li><router-link to="/contact">Contact</router-link></li>
        </ul>
      </div>

      <div class="col contact">
        <h4>Contact</h4>
        <p>Phone: <strong>+63 912 345 6789</strong></p>
        <p>Email: <strong>sales@cardeal.ph</strong></p>
        <p>Address: 123 Dealer St., Manila, PH</p>
      </div>
    </div>

    <div class="bottom">
      <p>© {{ new Date().getFullYear() }} CarDeal PH · Terms · Privacy</p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.site-footer { background:#0f0f10; color:#e8e8e8; padding:2rem 1rem 1rem; }
.container { max-width:1200px; margin:0 auto; }
.footer-grid { display:grid; grid-template-columns: 1fr 1fr 1fr; gap:1.2rem; align-items:start; }
.col h3, .col h4 { color:#fff; margin-bottom:.6rem; }
.col p, .col li, .col a { color:#cfcfcf; font-size:.95rem; }
.links ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:.45rem; }
.links a, .links router-link { color:#cfcfcf; text-decoration:none; }
.socials { display:flex; gap:.5rem; margin-top:.6rem; }
.soc { display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; background:#151515; color:#fff; border-radius:8px; text-decoration:none; font-weight:600; }

.bottom { border-top:1px solid rgba(255,255,255,0.04); margin-top:1rem; padding-top:1rem; text-align:center; color:#9a9a9a; font-size:.92rem; }

@media (max-width:900px){
  .footer-grid { grid-template-columns: 1fr; text-align:left; }
}
</style>
