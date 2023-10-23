import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const cookie = 'CognitoIdentityServiceProvider.5fmcp8jvm8213jpc1320eu6cs.LastAuthUser=GSuite_m.rylkin@osome.com; CognitoIdentityServiceProvider.5fmcp8jvm8213jpc1320eu6cs.GSuite_m.rylkin@osome.com.tokenScopesString=phone email profile openid aws.cognito.signin.user.admin; CognitoIdentityServiceProvider.5fmcp8jvm8213jpc1320eu6cs.GSuite_m.rylkin@osome.com.userData=%7B%22UserAttributes%22%3A%5B%7B%22Name%22%3A%22sub%22%2C%22Value%22%3A%22f9a1816d-4b4e-4674-a449-fec06dd03521%22%7D%2C%7B%22Name%22%3A%22email%22%2C%22Value%22%3A%22m.rylkin%40osome.com%22%7D%5D%2C%22Username%22%3A%22GSuite_m.rylkin%40osome.com%22%7D; amplify-signin-with-hostedUI=true; CognitoIdentityServiceProvider.5fmcp8jvm8213jpc1320eu6cs.GSuite_m.rylkin@osome.com.idToken=eyJraWQiOiIyNmVqaDlvNnJkRjNSUHFRbkRtckpzd2l0WDF1UnMrSlQ0djBFTVNsdGt3PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoidGZOTWlURzFlYjRXYVVObThEVHVoQSIsInN1YiI6ImY5YTE4MTZkLTRiNGUtNDY3NC1hNDQ5LWZlYzA2ZGQwMzUyMSIsImNvZ25pdG86Z3JvdXBzIjpbInVzLWVhc3QtMV93bGNRQ1VIVTJfR1N1aXRlIl0sImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfd2xjUUNVSFUyIiwiY29nbml0bzp1c2VybmFtZSI6IkdTdWl0ZV9tLnJ5bGtpbkBvc29tZS5jb20iLCJub25jZSI6InlDbTRIYmg1cWJHTmstYUFyd25yVFpxazVNQWROYl9NU2FFMjk0RmtNeU5RdVBkLXpXX2E3NzFjZE8xemJMb1Vma193dWpORDAwY1VVOVRKRXBFUHlUeWVfZF9IdThhMEt2U0xrS2tJTDRtOExoQk1LNEkxd2c2U0YzaWFUOXdGVnh1Q01oTHRyQ0ZqRHBKT2dYSE5oYWFzbWxQWTdrLXdOMjV4VEhuanpLdyIsImF1ZCI6IjVmbWNwOGp2bTgyMTNqcGMxMzIwZXU2Y3MiLCJpZGVudGl0aWVzIjpbeyJ1c2VySWQiOiJtLnJ5bGtpbkBvc29tZS5jb20iLCJwcm92aWRlck5hbWUiOiJHU3VpdGUiLCJwcm92aWRlclR5cGUiOiJTQU1MIiwiaXNzdWVyIjoiaHR0cHM6XC9cL2FjY291bnRzLmdvb2dsZS5jb21cL29cL3NhbWwyP2lkcGlkPUMwMzJhYzFvZCIsInByaW1hcnkiOiJ0cnVlIiwiZGF0ZUNyZWF0ZWQiOiIxNjI2MzYyNTI1MDIyIn1dLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY5NTIyMTkxNCwiZXhwIjoxNjk1MjI1NTE0LCJpYXQiOjE2OTUyMjE5MTQsImVtYWlsIjoibS5yeWxraW5Ab3NvbWUuY29tIn0.G9R3XdRW7841YaSYbN7htFtIAaw0EjhiXgKZ8UKO1RB51CIOArK-eUf27f-2pKKhSH0-kW4cWNQXZdJHy0Ht6xx9r8ACJx3VVt6rZMM7BY_h3R6vjYbep6I03YlCCibkcBYwQCNV3VkNvoQF8bRSZw6AHijtpdlKLEuf4rfaHzxi8L8B23haI2xsdGzsoAdmzQN5TdLrFVR1c65TFmx98_AyixfxMHdvMkST9Ro9Q3QhKuou0Qw4oJumaa20RdOhE071ePSxUida05R3C-pS6dmxzAhqLalPh44_gKTP2i6UBTzRDef1DZd_suwRau3mucze6WCoNpqBEQQ3cmlrjg; CognitoIdentityServiceProvider.5fmcp8jvm8213jpc1320eu6cs.GSuite_m.rylkin@osome.com.accessToken=eyJraWQiOiJJeHZSUzM5UmlQVzhaZVdlM2pqZVRQeTdDWjByRmJlQU9YdDFIU1FzTTk0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmOWExODE2ZC00YjRlLTQ2NzQtYTQ0OS1mZWMwNmRkMDM1MjEiLCJjb2duaXRvOmdyb3VwcyI6WyJ1cy1lYXN0LTFfd2xjUUNVSFUyX0dTdWl0ZSJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV93bGNRQ1VIVTIiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI1Zm1jcDhqdm04MjEzanBjMTMyMGV1NmNzIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiBwaG9uZSBvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTY5NTIyMTkxNCwiZXhwIjoxNjk1MjI1NTE0LCJpYXQiOjE2OTUyMjE5MTQsImp0aSI6IjQ5NDNjYjBhLTc4ODYtNDIzZS05OTM4LWM0YTc5OTY4NWM1OCIsInVzZXJuYW1lIjoiR1N1aXRlX20ucnlsa2luQG9zb21lLmNvbSJ9.Y8zqvJF6eNA1c6xPRRVTjohfrp0u4GxL0Zod_swQpkhyXPPnncmttZYPe8kFGLwHc0HDqoAXNWAJ0wjcD_QOhYCIxHWBjVm10MiXaZ1v9yF8b34vX4zInmDBS3SEuZ7KTmg0p481yWzPatb1L0qhZORLbx_A-D66STQm6P9ngu4_bqryU6c9sjItTfo-3A24fNizcZr_Zhz8Q88a3r8BM5SAnY654kTI3jmMqGxX7Ki62ipsdeKpGHVimiYeQuwf18kboOrSNgsR-OtNKnPKkMMpMEkJ9EjNq2BDSW0U9wVKsPBK3VjShK4PscRWbvvN1RwuBs97VdhnAATJF66aRA; CognitoIdentityServiceProvider.5fmcp8jvm8213jpc1320eu6cs.GSuite_m.rylkin@osome.com.refreshToken=eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.n5flWPiof4NQ6OjCGabGD0tduU81JFR1Mq4n0vdCzwv6pzPVggX4MaNdKd-WLD9u6Y49Jbnl7Zm1MAOsJ4LzRgs12gFv0N1AyBHbyGoUMH46TKYmCtlfPU3rwAm4WnD6rQEFkuS3-sPd5k_uS1ua_c-Zfg5qOyTiYKs9pDEOX1kFw9SiyW6kBKHOJUp8sp9Oo095dC4acgATcTCsDspnDUnp84W1Eli7X7I7YytzOMPyGanImkBDchjKBcNLYUw4jEoCFY9w6LFjAFhqDuTZtevtZOastnbm68UwBYn1IE3bMb82VuTUGPulEt4Z82ZuM0T7brrq8MZIeacNXYA3QQ.YGXPngsiMoUEp5hE.kM6oBYb1f91roJ3awWEvqCugz7c4wVOSh-DmvqFbkUW9E5yqa5kPDiCpmYK1V5P_zmURY9rAOjU2JfVOWWa9EApxJGcaY9Ebm5d1Ynr-U_i1P6R3kWXdSxxtGYrbCZkon6e0jwsgfTbAp5OC53LyqAKhKxQUcJ09Sw2Bss-CMfDqz9xlJ1eeyDxlhC5RPkryGQt-gz0M9aTT07l_nEDwk9_D_4L6DOkt2FhhzCBmQ3WXJ5UMqebSbQBgbIvIfkFaE0Z4NXM85J6155moJoWVRyu1ZFJnf6qQVMBGFnSN3e4OXYRAwa3tszvNb_jjqEKHTq2lkm9TXfu7K5l0KOsA5TFQflWMmwml9PN21UJpW01xjIArLDqTeqdFkYdktSWorB2Z8BozncYZKlolK8xoPXigmQ0r__NiCyOs79oovLBhor3uHEVG6zKi1gnX3IUhojzBXa5OlWo5rfHmPsNtZ8xsuTNsXnajDPhlHsu3Om81y4b1-jFrvwhHaz9PUE-FH7n6kpfHq8MvbWbm266YOSTCrBWwNi6cZcZgqPYgHWJcHCw-Nj05fHzRnWlB4LOy9iKq9L166AqE7iWfqwcw0wtyyV0Jbhqp8wOBlrtdcphRRknTwNq_FhdDyNjAGfl3-ebLcC_jUCsPAqUDdXmHt3hlsA_5pnTKTtL1jjwzxz1mmHuxEIh2VewN9tP5_7TTJ0MVWWGw0Hk3Qihsn8kg8a8md86jOpm39azelRLt72Vr7SsQlfEa5113cof7wbk-Of1_SMS8MGPqNWTH_ZjY7Z72ViWyvqcroiR8uyjAYl0yhXTEteOzhEsG_HnfBh-AtGA8xSg-Cpp9PJvU8o-gZLAUTw9E5z3UpWExGmHqk4QJ1DTRDiQo_IDe_eHorkeN7t3Uab76ZO8OxD6FoeSCm1CVmX8erllSCdOc742MaBoM5jZ_OmONcRxTEne0cy5EJsoK2HJD1dhpQQF1paKsdUc96n3sLRmDEbSr7OIOaqwyMUYCHEj7FD8pJnFo4egQjSodk4wYnyP33gWX6XPVb9xlC-vSGNK20j-QXuLULOuKXtVcJ9xk9YSxdlu-lJ2-GzCwHqBvmdHX9vKaY0SEYFSD-JJA17Qh85IJEApXrIuhb6Hi1mbSVSNzPpqTXJWXmxwc83TXEAz9lwFZmZYH5CPEXIVAg3iva6QNLYjQvlNLIPoSsmJNdzeKn_8p2o0AVOOJDRNeGqZpYiHxq275mPv3khujWZI7Z8uthGxHgoeduPIOqljm23ieJyWLDdgbTdb9_ZhWGRpAqVJo1zk2Qw.P-ne4_gH0JhXTK1SEtlEhA; access-token=3234565.TZatm0B4QzglWbAIyAOP5Jaw6gMAEbTeSekjjjDf; access-token-exp=2023-09-20T15:58:43.562Z; amp_8884d2=7gTuGDK0YI2zbO88w9b9o6...1haphjbk1.1haphk4au.0.0.0; amp_49323c=zlZvBDInh3h3JuMtuHmaxm.dW5kZWZpbmVk..1haphjfrl.1haphk4ht.2q9.0.2q9; AWSALB=2sZSngRfYKho5r0+HqbLyDDI5hi98gjT8eASKfydXu3K6b90YbwkEFlig3y6t7ujtIrzUssG7VToQOY3Z7KMaa4NanPCB+pOHWlq7rRgsAYmr9tH+ANEW9eRM1DM; AWSALBCORS=2sZSngRfYKho5r0+HqbLyDDI5hi98gjT8eASKfydXu3K6b90YbwkEFlig3y6t7ujtIrzUssG7VToQOY3Z7KMaa4NanPCB+pOHWlq7rRgsAYmr9tH+ANEW9eRM1DM';
const appoitmentDate = new Date().toISOString().split('T')[0];

async function run() {
    const dataRaw = fs.readFileSync(path.join(__dirname, './data.csv')).toString();
    let dataRawArray = dataRaw.split('\n').map(rowRaw => rowRaw.split(','));
    dataRawArray.shift();
    const data = dataRawArray.map(([companyId, userId]) => [Number(companyId), Number(userId)]);

    for (const [companyId, userId] of data) {
        // console.log(appoitmentDate);
        
        console.log('processing', companyId, userId);
        // continue;
        const response = await axios.get(`https://agent.osome.team/api/v2/companies/${companyId}/users`, {
            headers: {
                "accept": "application/json",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": cookie,
                "Referer": `https://agent.osome.team/companies/${companyId}/users`,
                "Referrer-Policy": "strict-origin-when-cross-origin"
              }
        });

        const ndCompanyUser = response.data.companyUsers.find((companyUser) => companyUser.userId === userId);

        if (ndCompanyUser) {
            console.log('company user exists: ', companyId, userId);
            const ndPosition = ndCompanyUser?.positions?.find(({ name }) => name === 'Nominee Director');
            
            if (!ndPosition) {
                console.log('\tcreate company user position: ', companyId, userId);
                await addPosition(companyId, ndCompanyUser.id, ndCompanyUser.positions.map(pos => ({
                    id: pos.id,
                    name: pos.name,
                    status: pos.status,
                    appointmentDate: pos.appointmentDate,
                    resignationDate: pos.resignationDate,
                })));
            } else {
                console.log('\tposition exists: ', companyId, userId);
            }
        } else {
            console.log('creating company user: ', companyId, userId);
            await createCompanyUser(companyId, userId, appoitmentDate);
        }
    }   
}

run();

async function createCompanyUser(companyId: number, userId: number, appointmentDate: string) {
    await axios.post(`https://agent.osome.team/api/v2/companies/${companyId}/users`, {
        "userId":userId,"companyUser":{"positions":[{"name":"Nominee Director","status":"Acting","appointmentDate":appointmentDate}]},"isAdmin":true,"isInactive":false
    }, {
        headers: {
            "accept": "application/json",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "cookie": cookie,
            "Referer": "https://agent.osome.team/companies/138839/users",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          }
    });
}

async function addPosition(companyId: number, companyUserId: number, positions: any[]) {
    await axios.patch(`https://agent.osome.team/api/v2/company_users/${companyUserId}`, {
        // "companyUser":{
            "positions":[
                ...positions,
                {"name":"Nominee Director","status":"Acting","appointmentDate":"2023-08-16",}
            ]
        // },
    }, {
        headers: {
            "accept": "application/json",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "cookie": cookie,
            "Referer": `https://agent.osome.team/companies/${companyId}/users`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
    });
}

async function updatePosition(companyId: number, userId: number) {
    const response = await axios.get(`https://agent.osome.team/api/v2/companies/${companyId}/users`, {
        headers: {
            "accept": "application/json",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "cookie": cookie,
            "Referer": `https://agent.osome.team/companies/${companyId}/users`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
          }
    });

    const ndCompanyUser = response.data.companyUsers.find((companyUser) => companyUser.userId === userId);
    const ndPosition = ndCompanyUser.positions.find(({ name }) => name === 'Nominee Director');
    console.log('response', ndPosition);
    // process.exit(0)
    await axios.patch(`https://agent.osome.team/api/v2/company_users/${ndCompanyUser.id}`, {
        // "companyUser":{
            "positions":[
                {"name":"Nominee Director","status":"Acting","appointmentDate":"2023-08-16", id: ndPosition.id}
            ]
        // },
    }, {
        headers: {
            "accept": "application/json",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "cookie": cookie,
            "Referer": `https://agent.osome.team/companies/${companyId}/users`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
    });
}