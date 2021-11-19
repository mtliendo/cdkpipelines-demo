import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core'
import { CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines'
import { CdkpipelinesDemoStage } from './cdkpipelines-demo-stage'
import { AmplifyStage } from './amplify-demo-stage'
/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props)

		const pipeline = new CodePipeline(this, 'Pipeline', {
			// The pipeline name
			pipelineName: 'MyServicePipeline',

			// How it will be built and synthesized
			synth: new ShellStep('Synth', {
				// Where the source can be found
				input: CodePipelineSource.gitHub('mtliendo/cdkpipelines-demo', 'main', {
					authentication: SecretValue.secretsManager('cdk-token'),
				}),

				// Install dependencies, build and run cdk synth
				commands: [
					'npm ci',
					'npm run build',
					'npx cdk synth',
					'npm i -g @aws-amplify/cli',
				],
			}),
		})

		pipeline.addStage(new AmplifyStage(this, 'amplifyStage'))
	}
}
