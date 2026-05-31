<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

// Ici je stocke les questions qui viennent de Supabase
const questions = ref([])

// Là je garde les réponses choisies par le joueur
const answers = ref({})

// Ici je garde le score final
const score = ref(null)

// Là je récupère le nom du joueur pour sauvegarder son score
const playerName = ref('')

// Ici je vérifie si le score a déjà été sauvegardé
const scoreSaved = ref(false)

// Ici je récupère les questions depuis Supabase
async function fetchQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('*')

  if (error) {
    alert(error.message)
    return
  }

  questions.value = data
}

// Là je calcule le score du joueur
function submitQuiz() {
  let total = 0

  questions.value.forEach((question) => {
    if (answers.value[question.id] === question.correct_answer) {
      total++
    }
  })

  score.value = total
  scoreSaved.value = false
}

// Ici je sauvegarde le score dans Supabase
async function saveScore() {
  if (!playerName.value.trim()) {
    alert('Entre ton nom avant de sauvegarder le score.')
    return
  }

  const { error } = await supabase
    .from('scores')
    .insert([
      {
        player_name: playerName.value,
        score: score.value,
        total_questions: questions.value.length
      }
    ])

  if (error) {
    alert(error.message)
    return
  }

  scoreSaved.value = true
}

onMounted(fetchQuestions)
</script>

<template>
  <div class="container py-4">
    <h1 class="text-center mb-4">Quiz</h1>

    <div
      v-for="question in questions"
      :key="question.id"
      class="card mb-3 shadow-sm"
    >
      <div class="card-body">
        <h3 class="card-title">{{ question.question }}</h3>

        <div class="form-check my-2">
          <input
            class="form-check-input"
            type="radio"
            :name="question.id"
            value="a"
            v-model="answers[question.id]"
          />
          <label class="form-check-label">
            {{ question.answer_a }}
          </label>
        </div>

        <div class="form-check my-2">
          <input
            class="form-check-input"
            type="radio"
            :name="question.id"
            value="b"
            v-model="answers[question.id]"
          />
          <label class="form-check-label">
            {{ question.answer_b }}
          </label>
        </div>

        <div class="form-check my-2">
          <input
            class="form-check-input"
            type="radio"
            :name="question.id"
            value="c"
            v-model="answers[question.id]"
          />
          <label class="form-check-label">
            {{ question.answer_c }}
          </label>
        </div>

        <div class="form-check my-2">
          <input
            class="form-check-input"
            type="radio"
            :name="question.id"
            value="d"
            v-model="answers[question.id]"
          />
          <label class="form-check-label">
            {{ question.answer_d }}
          </label>
        </div>
      </div>
    </div>

    <button class="btn btn-success w-100 mb-3" @click="submitQuiz">
      Valider
    </button>

    <div v-if="score !== null" class="card shadow-sm">
      <div class="card-body">
        <h2>Score : {{ score }} / {{ questions.length }}</h2>

        <input
          v-if="!scoreSaved"
          v-model="playerName"
          class="form-control my-3"
          placeholder="Entre ton nom"
        />

        <button
          v-if="!scoreSaved"
          class="btn btn-primary w-100"
          @click="saveScore"
        >
          Sauvegarder mon score
        </button>

        <p v-else class="text-success">
          Score sauvegardé pour {{ playerName }}.
        </p>
      </div>
    </div>
  </div>
</template>