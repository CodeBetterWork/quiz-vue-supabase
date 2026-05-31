<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

// Ici je gère l'accès à la page admin avec un simple code
const isAuthenticated = ref(false)
const accessCode = ref('')
const loginError = ref('')

// Là je stocke les questions qui viennent de Supabase
const questions = ref([])

// Ici je garde l'id de la question que je modifie
const editingId = ref(null)

// Là j'ai le formulaire pour ajouter ou modifier une question
const form = ref({
  question: '',
  answer_a: '',
  answer_b: '',
  answer_c: '',
  answer_d: '',
  correct_answer: 'a'
})

// Ici je vérifie si le code admin est correct
function login() {
  if (accessCode.value === 'bastos') {
    isAuthenticated.value = true
    loginError.value = ''
    fetchQuestions()
  } else {
    loginError.value = 'Code incorrect'
  }
}

// Là je déconnecte l'utilisateur
function logout() {
  isAuthenticated.value = false
  accessCode.value = ''
  resetForm()
}

// Ici je récupère les questions depuis Supabase
async function fetchQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    alert(error.message)
    return
  }

  questions.value = data
}

// Là j'ajoute une nouvelle question
async function addQuestion() {
  const { error } = await supabase
    .from('questions')
    .insert([form.value])

  if (error) {
    alert(error.message)
    return
  }

  resetForm()
  fetchQuestions()
}

// Ici je mets la question choisie dans le formulaire
function startEdit(question) {
  editingId.value = question.id

  form.value = {
    question: question.question,
    answer_a: question.answer_a,
    answer_b: question.answer_b,
    answer_c: question.answer_c,
    answer_d: question.answer_d,
    correct_answer: question.correct_answer
  }
}

// Là j'enregistre les modifications
async function updateQuestion() {
  const { error } = await supabase
    .from('questions')
    .update(form.value)
    .eq('id', editingId.value)

  if (error) {
    alert(error.message)
    return
  }

  resetForm()
  fetchQuestions()
}

// Ici j'annule la modification
function cancelEdit() {
  resetForm()
}

// Là je remets le formulaire à zéro
function resetForm() {
  editingId.value = null

  form.value = {
    question: '',
    answer_a: '',
    answer_b: '',
    answer_c: '',
    answer_d: '',
    correct_answer: 'a'
  }
}

// Ici je supprime une question avec son id
async function deleteQuestion(id) {
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id)

  if (error) {
    alert(error.message)
    return
  }

  fetchQuestions()
}
</script>

<template>
  <div class="container py-4">
    <div v-if="!isAuthenticated" class="card mx-auto shadow-sm" style="max-width: 420px;">
      <div class="card-body">
        <h1 class="mb-3">Accès administration</h1>

        <input
          v-model="accessCode"
          type="password"
          class="form-control mb-3"
          placeholder="Code d'accès"
          @keyup.enter="login"
        />

        <button class="btn btn-primary w-100" @click="login">
          Se connecter
        </button>

        <p v-if="loginError" class="text-danger mt-3">
          {{ loginError }}
        </p>
      </div>
    </div>

    <div v-else>
      <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <h1>Administration</h1>

        <button class="btn btn-secondary" @click="logout">
          Déconnexion
        </button>
      </div>

      <div class="card mb-4 shadow-sm">
        <div class="card-body">
          <h2 v-if="editingId">Modifier une question</h2>
          <h2 v-else>Ajouter une question</h2>

          <input
            v-model="form.question"
            class="form-control my-2"
            placeholder="Question"
          />

          <input
            v-model="form.answer_a"
            class="form-control my-2"
            placeholder="Réponse A"
          />

          <input
            v-model="form.answer_b"
            class="form-control my-2"
            placeholder="Réponse B"
          />

          <input
            v-model="form.answer_c"
            class="form-control my-2"
            placeholder="Réponse C"
          />

          <input
            v-model="form.answer_d"
            class="form-control my-2"
            placeholder="Réponse D"
          />

          <select
            v-model="form.correct_answer"
            class="form-select my-2"
          >
            <option value="a">A est correcte</option>
            <option value="b">B est correcte</option>
            <option value="c">C est correcte</option>
            <option value="d">D est correcte</option>
          </select>

          <button
            v-if="!editingId"
            class="btn btn-primary w-100 mt-2"
            @click="addQuestion"
          >
            Ajouter
          </button>

          <button
            v-else
            class="btn btn-success w-100 mt-2"
            @click="updateQuestion"
          >
            Enregistrer les modifications
          </button>

          <button
            v-if="editingId"
            class="btn btn-secondary w-100 mt-2"
            @click="cancelEdit"
          >
            Annuler
          </button>
        </div>
      </div>

      <div
        v-for="question in questions"
        :key="question.id"
        class="card mb-3 shadow-sm"
      >
        <div class="card-body">
          <h3>{{ question.question }}</h3>

          <p>A : {{ question.answer_a }}</p>
          <p>B : {{ question.answer_b }}</p>
          <p>C : {{ question.answer_c }}</p>
          <p>D : {{ question.answer_d }}</p>
          <p>Bonne réponse : {{ question.correct_answer.toUpperCase() }}</p>

          <div class="d-flex flex-column flex-md-row gap-2">
            <button class="btn btn-warning" @click="startEdit(question)">
              Modifier
            </button>

            <button class="btn btn-danger" @click="deleteQuestion(question.id)">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>