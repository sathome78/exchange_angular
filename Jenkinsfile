pipeline {
    environment {
     XCODE_BUILD_NUMBER = VersionNumber(projectStartDate: '1970-01-01', versionNumberString: '0.0.${BUILDS_ALL_TIME}', versionPrefix: '')
    }
  agent any
    stages {
    stage('Build docker image') {
      agent any      
      steps {
        echo XCODE_BUILD_NUMBER
        sh "sed -i s/${${VERSION}}/${XCODE_BUILD_NUMBER}/g package.json"
        sh 'docker build --build-arg ENVIRONMENT -t roadtomoon/exrates_angular:$ENVIRONMENT .'
      }
    } 
    stage('Push docker image') {
      agent any
      steps {
        sh 'docker tag roadtomoon/exrates_angular:$ENVIRONMENT 172.50.50.7:5000/exrates_angular:$ENVIRONMENT'
        sh 'docker push 172.50.50.7:5000/exrates_angular:$ENVIRONMENT'
      }
    } 
   stage('Deploy container to $ENVIRONMENT') {
        steps {
         sh 'docker -H tcp://172.50.50.7:2376 service update --image localhost:5000/exrates_angular:$ENVIRONMENT $ENVIRONMENT-angular'
      }
    }
  }  
}