//  This lambda function helps to create and rotate the 
//  password for elasticache


import { SecretsManagerClient,GetSecretValueCommand,GetRandomPasswordCommand,UpdateSecretCommand } from "@aws-sdk/client-secrets-manager";
import { ElastiCacheClient, ModifyUserCommand,DescribeUsersCommand} from "@aws-sdk/client-elasticache";
export const handler = async (event, context) => {
    const secret_client = new SecretsManagerClient();
    const elastic_client = new ElastiCacheClient();
    
    const secret_input = { // GetSecretValueRequest
        SecretId: "arn:aws:secretsmanager:ap-south-1:542662511196:secret:for-redis-uCJCqm"
    };
    const secret_command = new GetSecretValueCommand(secret_input);
    const secret_response = await secret_client.send(secret_command);
    const username= JSON.parse(secret_response.SecretString).username
    
    
    
    if(username=='roshan'){     //  Here if username is match with redis username 
                                //  in Users=>UserGroup then only it will execute
        try{                    //  it helps to reduce the invocation if not match


            //  function to create random password
            const passwd_gen=async()=>{
                try{
                    const input = {
                        "IncludeSpace": false,
                        "PasswordLength": 20,
                        "RequireEachIncludedType": true,
                        "ExcludeCharacters":'"\'`$#!\u005C'
                    };
                    const command = new GetRandomPasswordCommand(input);
                    const response = await secret_client.send(command);
                    console.log("Password creation successful")
                    return response.RandomPassword   
                }catch(error){
                    throw new Error(`Error in generating passowrd:${error}`)
                }
            }
            const new_passwd=await passwd_gen()     // Here we generate the password
            const new_secret={
                "username":"roshan",
                "password":new_passwd
            }
        
        
            // function to update the cache with new password
            const cache_update=async()=>{
                try{
                    const input = {
                            UserId: "roshan",
                            NoPasswordRequired: false,
                            AuthenticationMode: {
                                Type: "password",
                                    Passwords: [
                                        new_passwd,
                                    ],
                            }
                    }
                const command = new ModifyUserCommand(input);
                await elastic_client.send(command);
                console.log("Cache update successful")
                }catch(error){
                    throw new Error(`Error while updating the cache:${error}`)
                }
            }
        

            //  function to update the secretemanager
            const ssm_update=async()=>{
                try{
                    const input = {
                        SecretId: "arn:aws:secretsmanager:ap-south-1:542662511196:secret:for-redis-uCJCqm",
                        SecretString: JSON.stringify(new_secret)
                    }
                    const command = new UpdateSecretCommand(input);
                    await secret_client.send(command);
                    console.log("SSM update successful")
                }catch(error){
                    throw new Error(`Error while updating the secret manager:${error}`)
                }
            }

            //  here we update the secrete manager then cache
            await ssm_update()
            await cache_update()
        }catch(error){
            console.log(error)
        }
        
    }else{
        console.log("Username not found")
        return
    }
};
