// This module use to get the password from Secrete Manager
// with the help of SDK
// id=id of secrete
// version=(AWSCURRENT,AWSPREVIOUS)

const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const client = new SecretsManagerClient();
async function ssm_gpd(id,version){
	try{
		const input = {
  			SecretId: id,
  			VersionStage: version,
		};
		const command = new GetSecretValueCommand(input);
		const response = await client.send(command);
		return (JSON.parse(response.SecretString).password)
	}catch(error)
	{
		throw new Error(error)
	}
}

module.exports={ssm_gpd}
