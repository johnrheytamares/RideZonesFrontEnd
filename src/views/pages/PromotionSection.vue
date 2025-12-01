<template>
  <section class="promotions section" aria-label="Reserve Your Dream Ride">
    <div class="container">
      <div class="promo-header">
        <h2>Reserve Your Dream Ride</h2>
        <p class="sub">Schedule a private viewing of our exclusive luxury collection</p>
      </div>

      <div class="carousel" @mouseenter="pause" @mouseleave="play">
        <div class="track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <div class="slide" v-for="(car, i) in featuredCars" :key="car.id">
            <div class="promo-card">
              <!-- Car Image -->
              <img 
                :src="car.main_image || getPlaceholderImage(car.make)" 
                :alt="car.make + ' ' + car.model"
                loading="lazy"
              />

              <div class="promo-body">
                <h3>{{ car.make }} {{ car.model }} {{ car.variant ? car.variant : '' }}</h3>
                <p class="desc">
                  {{ car.year }} • {{ car.color || 'Premium' }} • {{ car.mileage || 'Low Mileage' }} km
                </p>
                
                <div class="meta">
                  <span class="price">₱{{ Number(car.price).toLocaleString() }}</span>
                  <button 
                    class="btn" 
                    @click="reserveCar(car)"
                    :disabled="car.status !== 'available'"
                  >
                    {{ car.status === 'available' ? 'View' : 'Reserved' }}
                  </button>
                </div>

                <!-- Quick Specs -->
                <div class="car-specs">
                  <span><i class="fas fa-gas-pump"></i> {{ car.fuel_type }}</span>
                  <span><i class="fas fa-cog"></i> {{ car.transmission }}</span>
                  <span v-if="car.warranty_period"><i class="fas fa-shield-alt"></i> {{ car.warranty_period }} mo warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dots -->
        <div class="dots">
          <button 
            v-for="(car,i) in featuredCars" 
            :key="i" 
            :class="{ active: i === currentIndex }" 
            @click="go(i)"
            :aria-label="`View ${car.make} ${car.model}`"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const featuredCars = ref([])
const currentIndex = ref(0)
let timer = null

// Fetch cars from your backend
const fetchCars = async () => {
  try {
    const res = await fetch('https://ridezonesbackends-dzei.onrender.com/listcars', {
      credentials: 'include'  // For session if logged in
    })
    const data = await res.json()

    if (data.status === 'success') {
      // Filter for featured/available cars (limit to 5-6 for carousel)
      featuredCars.value = data.cars
        .filter(car => car.status === 'available')  // Show only available
        .slice(0, 6)  // Limit to 6 for carousel
        .map(car => ({
          ...car,
          // Format price if needed
          price: car.price || 0
        }))
    }
  } catch (err) {
    console.error('Failed to fetch cars:', err)
    // Fallback data if API fails
    featuredCars.value = [
      { id: 1, make: 'Lamborghini', model: 'Aventador', year: 2023, price: 48500000, color: 'Green', main_image: 'https://via.placeholder.com/600x400/228B22/FFFFFF?text=Lamborghini', status: 'available' },
      { id: 2, make: 'Ferrari', model: 'SF90', year: 2023, price: 42000000, color: 'Red', main_image: 'https://via.placeholder.com/600x400/DC143C/FFFFFF?text=Ferrari', status: 'available' }
    ]
  }
}

const play = () => {
  stopTimer()
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % featuredCars.value.length
  }, 4500)
}

const pause = () => stopTimer()
const stopTimer = () => { if (timer) clearInterval(timer); timer = null }
const go = (i) => currentIndex.value = i

const reserveCar = (car) => {
  if (car.status === 'available') {
    router.push(`/cars-page`)
  }
}

const getPlaceholderImage = (make) => {
  return `https://via.placeholder.com/600x400/111/FFFFFF?text=${encodeURIComponent(make)}`
}

onMounted(() => {
  fetchCars()  // Load cars on mount
  play()
})

onBeforeUnmount(() => stopTimer())
</script>

<!-- YOUR ORIGINAL STYLE — EXACT SAME, NO CHANGES -->
<style scoped>
.section { padding: 4rem 1rem; background: #f8f8f9; }
.container { max-width: 1200px; margin: 0 auto; }

.promo-header { text-align:center; margin-bottom:1.6rem; }
.promo-header h2 { font-size:2rem; color:#111; }
.promo-header .sub { color:#666; }

.carousel { position: relative; overflow: hidden; border-radius:12px; background: #fff; padding: 1rem; box-shadow: 0 12px 30px rgba(17,17,17,0.04); }
.track { display: flex; transition: transform .6s cubic-bezier(.22,.9,.35,1); width: 100%; }
.slide { min-width: 100%; box-sizing: border-box; padding: .6rem; display:flex; align-items:center; justify-content:center; }
.promo-card { display:flex; gap:1rem; align-items:center; width:100%; }
.promo-card img { width: 48%; height: 220px; object-fit:cover; border-radius:10px; }
.promo-body { width: 52%; }
.promo-body h3 { margin:0 0 .5rem; font-size:1.2rem; color:#111; }
.desc { color:#555; margin-bottom:1rem; }
.meta { display:flex; align-items:center; gap:1rem; }
.price { color: #c1121f; font-weight:700; font-size:1.05rem; }
.btn { background:#c1121f; color:white; border:none; padding:.6rem 1rem; border-radius:8px; cursor:pointer; }

.dots { position:absolute; left:50%; transform:translateX(-50%); bottom:.8rem; display:flex; gap:.5rem; }
.dots button { width:10px; height:10px; border-radius:50%; border:none; background:#ddd; cursor:pointer; }
.dots button.active { background:#c1121f; transform:scale(1.08); }
@media (max-width:800px){
  .promo-card { flex-direction: column; }
  .promo-card img, .promo-body { width: 100%; }
}
</style>