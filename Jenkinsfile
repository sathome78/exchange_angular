pipeline {
  VersionNumber projectStartDate: '', versionNumberString: '0.0.${BUILDS_ALL_TIME}', versionPrefix: '', worstResultForIncrement: 'SUCCESS'
  agent any
    stages {
  
    stage('Prepare docker image') {
      agent any      
      steps {
        
        sh "sed -i "s/${VERSION}/${VersionNumber}/g" package.json"
        sh 'docker build --build-arg ENVIRONMENT -t roadtomoon/exrates_angular:$ENVIRONMENT .'
      }
    } 
    stage('Docker pull') {
      agent any
      steps {
        sh 'docker tag roadtomoon/exrates-core-exrates_angular:$ENVIRONMENT 172.50.50.7:5000/exrates_angular:$ENVIRONMENT'
        sh 'docker push 172.50.50.7:5000/exrates_angular:$ENVIRONMENT'
      }
    } 
/*    stage('Deploy container') {
      steps {
        sh 'docker -H tcp://172.50.50.7:2376 service update --image localhost:5000/exrates_angular:$ENVIRONMENT $ENVIRONMENT-angular'
      }
    }
  }
*/  
}