pipeline{

	agent any

	environment {
		DOCKERHUB_CREDENTIALS=credentials('docker-e-commerce-ID')
	}

	stages {

		stage('Build') {

			steps {
				sh 'docker build -t alazidis/e-commerce-auth ./backend/auth/'
			}
		}

		stage('Login') {

			steps {
				sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
			}
		}

		stage('Push') {

			steps {
				sh 'docker push alazidis/e-commerce-auth'
			}
		}
	}

	post {
		always {
			sh 'docker logout'
		}
	}

}
