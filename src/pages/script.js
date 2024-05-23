const passwordForm = document.getElementById('passwordForm');
const passwordInput = document.getElementById('passwordInput');
const contentDiv = document.getElementById('content');

const correctPassword = 'yourpassword'; 

passwordForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const enteredPassword = passwordInput.value;

  if (enteredPassword === correctPassword) {
    passwordForm.style.display = 'none';
    contentDiv.style.display = 'block';
  } else {
    alert('Incorrect password. Please try again.');
    passwordInput.value = '';
  }
});