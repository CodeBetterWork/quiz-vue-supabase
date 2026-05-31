<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

// Ici je stocke les scores récupérés depuis Supabase
const scores = ref([])

// Là je récupère les scores pour les afficher sur l'accueil
async function fetchScores() {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('score', { ascending: false })

  if (error) {
    alert(error.message)
    return
  }

  scores.value = data
}

onMounted(fetchScores)
</script>

<template>
  <div class="container py-4">
    <div class="text-center mb-4">
      <h1 class="mb-3">Quiz App</h1>

      <div class="d-flex flex-column flex-md-row justify-content-center gap-3">
        <router-link to="/quiz">
          <button class="btn btn-primary w-100">
            Commencer le quiz
          </button>
        </router-link>

        <router-link to="/admin">
          <button class="btn btn-dark w-100">
            Administration
          </button>
        </router-link>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <h2 class="mb-3">Classement des joueurs</h2>

        <div class="table-responsive">
          <table class="table table-striped align-middle">
            <thead>
              <tr>
                <th>Joueur</th>
                <th>Score</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="score in scores" :key="score.id">
                <td>{{ score.player_name }}</td>
                <td>{{ score.score }} / {{ score.total_questions }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-if="scores.length === 0" class="text-muted">
          Aucun score enregistré pour le moment.
        </p>
      </div>
    </div>
  </div>
</template>