<template>
  <div class="cars-dashboard min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
    <!-- Luxury Red Glow Background -->
    <div class="glow-bg" aria-hidden="true"></div>

    <div class="max-w-7xl mx-auto px-6 py-10 relative z-10">

      <!-- Header Panel -->
      <div class="glass-panel rounded-2xl p-8 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div class="flex items-center gap-6">
            <div class="icon-circle">
              <i class="fas fa-car-side text-2xl"></i>
            </div>
            <div>
              <h1 class="text-3xl font-bold">Cars Management</h1>
              <p class="text-gray-400 text-sm mt-1 opacity-90">
                Manage vehicle inventory • {{ filteredCars.length }} of {{ cars.length }} vehicles
              </p>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:w-auto">
            <div class="stat-box">
              <i class="fas fa-car text-2xl text-red-500"></i>
              <div class="mt-4 text-center">
                <div class="text-3xl font-bold">{{ cars.length }}</div>
                <div class="text-xs text-gray-400 uppercase tracking-wider">Total Vehicles</div>
              </div>
            </div>
            <div class="stat-box">
              <i class="fas fa-check-circle text-2xl text-emerald-500"></i>
              <div class="mt-4 text-center">
                <div class="text-3xl font-bold">{{ availableCount }}</div>
                <div class="text-xs text-gray-400 uppercase tracking-wider">Available</div>
              </div>
            </div>
            <div class="stat-box">
              <i class="fas fa-clock text-2xl text-amber-500"></i>
              <div class="mt-4 text-center">
                <div class="text-3xl font-bold">{{ reservedCount }}</div>
                <div class="text-xs text-gray-400 uppercase tracking-wider">Reserved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Panel -->
      <div class="glass-panel rounded-2xl overflow-hidden">
        <!-- Form Section -->
        <div class="p-8 border-b border-white/5">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-xl font-bold flex items-center gap-3">
              <i :class="isEditing ? 'fas fa-edit text-amber-500' : 'fas fa-plus text-emerald-500'"></i>
              {{ isEditing ? 'Update Vehicle' : 'Add New Vehicle' }}
            </h3>
            <span class="text-xs px-5 py-2 rounded-full font-bold border"
                  :class="isEditing 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'">
              {{ isEditing ? 'EDITING MODE' : 'CREATING NEW' }}
            </span>
          </div>

          <!-- Duplicate Warning -->
          <div v-if="isDuplicateCar" class="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-400">
            <i class="fas fa-exclamation-triangle text-xl"></i>
            <div>
              <p class="font-bold">Duplicate Vehicle Detected!</p>
              <p class="text-sm">A car with the same Make, Model, Year, and Variant already exists.</p>
            </div>
          </div>

          <form @submit.prevent="isEditing ? updateCar() : createCar()" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <!-- Your existing form fields here... (unchanged) -->
            <!-- ... [All your input fields remain exactly the same] ... -->

            <!-- Action Buttons -->
            <div class="xl:col-span-4 flex gap-4 justify-end mt-6">
              <button v-if="isEditing" type="button" @click="cancelEdit"
                      class="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition">
                Cancel Edit
              </button>
              <button type="submit" :disabled="loading || isDuplicateCar"
                      class="px-10 py-4 rounded-xl font-bold text-sm transition shadow-2xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      :class="isEditing 
                        ? 'bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800' 
                        : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900'">
                <i :class="loading ? 'fas fa-spinner fa-spin' : (isEditing ? 'fas fa-save' : 'fas fa-plus')"></i>
                {{ loading ? 'Saving...' : (isEditing ? 'Update Vehicle' : 'Add Vehicle') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Table Section with Search -->
        <div class="p-8">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
             <h3 class="text-xl font-bold flex items-center gap-3">
                <i class="fas fa-th-list text-red-500"></i>
                Vehicle Inventory
                </h3>

                <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <!-- Search Bar -->
                <div class="relative">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                    <input v-model="searchQuery" placeholder="Search by Make, Model, Year, Price, Status..."
                        class="w-full sm:w-96 pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-red-500 focus:outline-none transition" />
                </div>

                <button @click="fetchCars" class="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition whitespace-nowrap">
                    <i class="fas fa-sync-alt" :class="{ 'animate-spin': loading }"></i>
                    Refresh
                </button>
                </div>
          </div>

          <!-- Empty or No Results State -->
          <div v-if="!loading && filteredCars.length === 0" class="text-center py-24 bg-white/5 rounded-2xl border border-white/10">
            <i class="fas fa-car-crash text-8xl text-gray-700 mb-6"></i>
            <h3 class="text-2xl font-bold text-gray-400 mb-3">
              {{ searchQuery ? 'No vehicles match your search' : 'No Vehicles Found' }}
            </h3>
            <p class="text-gray-500">
              {{ searchQuery ? 'Try different keywords' : 'Start building your luxury inventory' }}
            </p>
          </div>

          <!-- Cars Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left text-xs text-gray-400 border-b border-white/10">
                  <th class="pb-5">ID</th>
                  <th class="pb-5">Dealer</th>
                  <th class="pb-5">Vehicle</th>
                  <th class="pb-5">Year</th>
                  <th class="pb-5">Price</th>
                  <th class="pb-5">Status</th>
                  <th class="pb-5">Warranty</th>
                  <th class="pb-5">Image</th>
                  <th class="pb-5">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr v-for="car in filteredCars" :key="car.id"
                    class="hover:bg-white/5 transition"
                    :class="{ 'bg-amber-500/5 border-l-4 border-amber-500': isEditing && editId === car.id }">
                  <td class="py-6 font-mono text-sm">#{{ car.id }}</td>
                  <td class="py-6">{{ car.dealer_id }}</td>
                  <td class="py-6 font-semibold">{{ car.make }} {{ car.model }} {{ car.variant || '' }}</td>
                  <td class="py-6">
                    <span class="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold">{{ car.year }}</span>
                  </td>
                  <td class="py-6 font-bold">₱{{ Number(car.price).toLocaleString() }}</td>
                  <td class="py-6">
                    <span class="px-4 py-2 rounded-full text-xs font-bold"
                          :class="{
                            'bg-emerald-500/10 text-emerald-400': car.status === 'available',
                            'bg-amber-500/10 text-amber-400': car.status === 'reserved',
                            'bg-rose-500/10 text-rose-400': car.status === 'sold',
                            'bg-gray-500/10 text-gray-400': car.status === 'draft'
                          }">
                      {{ car.status.toUpperCase() }}
                    </span>
                  </td>
                  <td class="py-6 text-sm">
                    <span v-if="car.warranty_end_date" class="text-emerald-400">
                      Until {{ formatDate(car.warranty_end_date) }}
                    </span>
                    <span v-else class="text-gray-500">—</span>
                  </td>
                  <td class="py-6">
                    <img v-if="car.main_image"
                        :src="getCarImage(car.main_image)"
                        class="w-24 h-16 object-cover rounded-xl border border-white/10 shadow-lg"
                        @error="($event) => $event.target.src = '/default-car.jpg'" />
                    <div v-else class="w-24 h-16 bg-white/5 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center">
                      <i class="fas fa-image text-gray-600"></i>
                    </div>
                  </td>
                  <td class="py-6">
                    <div class="flex gap-3">
                      <button @click="editCar(car)"
                              class="p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition"
                              :disabled="isEditing">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="deleteCar(car.id)"
                              class="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition"
                              :disabled="isEditing">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" class="fixed bottom-8 right-8 px-8 py-5 rounded-2xl font-bold text-sm shadow-2xl z-50 animate-slideIn"
         :class="toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive state
const loading = ref(false)
const cars = ref([])
const isEditing = ref(false)
const editId = ref(null)
const previewImage = ref('')
const additionalImages = ref([])
const searchQuery = ref('')  // ← NEW: Search input
const toast = ref({ show: false, message: '', type: 'success' })

const form = ref({
  dealer_id: '', make: '', model: '', variant: '', year: '', price: '',
  main_image: '', description: '', status: 'available',
  warranty_period: 36, warranty_start_date: '', warranty_end_date: '', service_history: ''
})

const API_BASE = 'https://ridezonesbackends-dzei.onrender.com'

// Filtered cars based on search
const filteredCars = computed(() => {
  if (!searchQuery.value.trim()) return cars.value

  const query = searchQuery.value.toLowerCase()
  return cars.value.filter(car => {
    const fullName = `${car.make} ${car.model} ${car.variant || ''} ${car.year || ''}`.toLowerCase()
    const price = car.price?.toString()
    const status = car.status?.toLowerCase()
    const dealer = car.dealer_id?.toString()

    return fullName.includes(query) ||
           price.includes(query) ||
           status.includes(query) ||
           dealer.includes(query)
  })
})

// Counts
const availableCount = computed(() => cars.value.filter(c => c.status === 'available').length)
const reservedCount = computed(() => cars.value.filter(c => c.status === 'reserved').length)

// Duplicate check: Make + Model + Year + Variant
const isDuplicateCar = computed(() => {
  if (!form.value.make?.trim() || !form.value.model?.trim()) return false

  const newKey = `${form.value.make.trim()} ${form.value.model.trim()} ${form.value.year || ''} ${form.value.variant?.trim() || ''}`.toLowerCase()

  return cars.value.some(car => {
    if (isEditing.value && car.id === editId.value) return false
    const existingKey = `${car.make} ${car.model} ${car.year || ''} ${car.variant || ''}`.trim().toLowerCase()
    return existingKey === newKey
  })
})

// Rest of your functions (image handling, CRUD, etc.) remain unchanged...
// ... [Keep all your existing functions: getCarImage, calculateWarrantyEnd, handleImageUpload, etc.]

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => toast.value.show = false, 4000)
}

const createCar = async () => {
  if (isDuplicateCar.value) {
    showToast('This vehicle already exists in inventory!', 'error')
    return
  }
  // ... rest of your create logic
}

const updateCar = async () => {
  if (isDuplicateCar.value) {
    showToast('Another vehicle with same details already exists!', 'error')
    return
  }
  // ... rest of update logic
}

// ... keep all other functions exactly as they were

onMounted(() => {
  fetchCars()
})
</script>

<!-- Your existing styles remain unchanged -->
<style scoped>
/* ... all your beautiful styles ... */
</style>