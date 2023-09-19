import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const cookie = 'CognitoIdentityServiceProvider.5fmcp8jvm8213jpc1320eu6cs.LastAuthUser=GSuite_m.rylkin@osome.com; CognitoIdentityServiceProvider.5fmcp8jvm8213jpc1320eu6cs.GSuite_m.rylkin@osome.com.tokenScopesString=phone email profile openid aws.cognito.signin.user.admin; CognitoIdentityServiceProvider.5fmcp8jvm8213jpc1320eu6cs.GSuite_m.rylkin@osome.com.userData=%7B%22UserAttributes%22%3A%5B%7B%22Name%22%3A%22sub%22%2C%22Value%22%3A%22f9a1816d-4b4e-4674-a449-fec06dd03521%22%7D%2C%7B%22Name%22%3A%22email%22%2C%22Value%22%3A%22m.rylkin%40osome.com%22%7D%5D%2C%22Username%22%3A%22GSuite_m.rylkin%40osome.com%22%7D; amplify-signin-with-hostedUI=true; CognitoIdentityServiceProvider.5fmcp8jvm8213jpc1320eu6cs.GSuite_m.rylkin@osome.com.idToken=eyJraWQiOiIyNmVqaDlvNnJkRjNSUHFRbkRtckpzd2l0WDF1UnMrSlQ0djBFTVNsdGt3PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiaFA5SUJCQVRjZGotblAycjNqU0FlUSIsInN1YiI6ImY5YTE4MTZkLTRiNGUtNDY3NC1hNDQ5LWZlYzA2ZGQwMzUyMSIsImNvZ25pdG86Z3JvdXBzIjpbInVzLWVhc3QtMV93bGNRQ1VIVTJfR1N1aXRlIl0sImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfd2xjUUNVSFUyIiwiY29nbml0bzp1c2VybmFtZSI6IkdTdWl0ZV9tLnJ5bGtpbkBvc29tZS5jb20iLCJub25jZSI6Imp4RlBQam9NRm1rdGdMVHUzRlNXWm1ucVB4dEFWSzQ4cFg3VHA3MWpDS3prLTZhSGtRTmhmTEJESmNfSWJ5S3VQVFhEX2JSMnZRbE13Z21SRWRCa3M1Y19FNzdFaXBSeGxySGxIVUZKbWZFdjdzdjZsb3Q5Njg1WFBVbUc3M042RzlFdUN1eFZWcHEyQUJmVEtLcTZ2RnkwVEotV3J6VHFFMUp5UFM5MGRvUSIsImF1ZCI6IjVmbWNwOGp2bTgyMTNqcGMxMzIwZXU2Y3MiLCJpZGVudGl0aWVzIjpbeyJ1c2VySWQiOiJtLnJ5bGtpbkBvc29tZS5jb20iLCJwcm92aWRlck5hbWUiOiJHU3VpdGUiLCJwcm92aWRlclR5cGUiOiJTQU1MIiwiaXNzdWVyIjoiaHR0cHM6XC9cL2FjY291bnRzLmdvb2dsZS5jb21cL29cL3NhbWwyP2lkcGlkPUMwMzJhYzFvZCIsInByaW1hcnkiOiJ0cnVlIiwiZGF0ZUNyZWF0ZWQiOiIxNjI2MzYyNTI1MDIyIn1dLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY5NTEyNTMxNywiZXhwIjoxNjk1MTI4OTE3LCJpYXQiOjE2OTUxMjUzMTcsImVtYWlsIjoibS5yeWxraW5Ab3NvbWUuY29tIn0.p6kK91g8Os4e4O8qb99MghJJSJZOoam_wFkMdKakwoHs-djgsBT5zekeYIqNxEcZFNwLNw0R5eyC-astBoFpAzB19G4sumDZeHItPeg5c7XKo3RxnsJJtNLauEmO-RMEEaMded-FquE45uAM-vPev2srbIhTPY36BWIlFzO3z2LSJ57MShyQhPv1L8q_-J5la5S3DHxFN4smg2J_crPzcskbqakKVpbbidiaMi_-Ux9vmQVtrQFSQ2PdSNd0eIl5ZpTG3EPL_V6reO9uFqqpVotqeEwK0DCpNfuRs2ZFdM5jbdz1e8Oh7hm0rYXADWEZnUx26NxuC7hLc5W5B3OI4A; CognitoIdentityServiceProvider.5fmcp8jvm8213jpc1320eu6cs.GSuite_m.rylkin@osome.com.accessToken=eyJraWQiOiJJeHZSUzM5UmlQVzhaZVdlM2pqZVRQeTdDWjByRmJlQU9YdDFIU1FzTTk0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmOWExODE2ZC00YjRlLTQ2NzQtYTQ0OS1mZWMwNmRkMDM1MjEiLCJjb2duaXRvOmdyb3VwcyI6WyJ1cy1lYXN0LTFfd2xjUUNVSFUyX0dTdWl0ZSJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV93bGNRQ1VIVTIiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI1Zm1jcDhqdm04MjEzanBjMTMyMGV1NmNzIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiBwaG9uZSBvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTY5NTEyNTMxNywiZXhwIjoxNjk1MTI4OTE3LCJpYXQiOjE2OTUxMjUzMTcsImp0aSI6ImRmNzlkYmVhLTU0NDQtNDQ0Ny1hMmUxLWFlZDNhZWMyM2ZjYyIsInVzZXJuYW1lIjoiR1N1aXRlX20ucnlsa2luQG9zb21lLmNvbSJ9.XawTB2GCVB-OiXIEmb5oxYSqIWu2escPaP-D3HkrSI03nm-CdHd9mjkiqpGEFRkuN1cYPIyqQPB4hfMtOlJZMSO1jpo6lsVet6007CHCCid9xL6Te18pN_4hP_wStLDSHM2e1eI3YLvmDN9s_WRWttVDrtD0SlovDOAzb7jml6lY_3z2EG9PK-a8U2eBAC_rwuDURf1ldPZJ5rH7Lpl6YsN8c8kpvRxBMASzQpDEZ9XVmElphSIMe5_G5ymPYWGRJ8dU-aue8gz3gWFt01FmYhymS3xmjpRGKDGNCOfFypL1Sk6NTVMzCEcqymyEog5GRP17GwlH5OyTuI696kANPw; CognitoIdentityServiceProvider.5fmcp8jvm8213jpc1320eu6cs.GSuite_m.rylkin@osome.com.refreshToken=eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.ZoVTrjXw4ZJa7Gc2EF0EIowuEd-3D7OdhBgsyFfviSh1iHSEoXo71JnIglp4gpa5aAN6A68Pa-jO6e9tUKVSSHf28S1dOt6r-FhLftVpyu_4hRP6rb6n0QaM0RbLTEZeuToQlltIDUCU9LO5JCjLJgOhzAyjT_G5asmKYfd8H-MVcjU6yPXgfm7KTiRxo2RM_iv_2iIUucrx3aWMFde02xqjI2aV8RpkmhwKhUSwahh2Z0J0cTpwDz_ocvojOyPz18_K-jlIB4hwPIunv19wWtgWzFba5oWRyIn5XL5VpuDtRgpZFEnE1_FoX8gM_qp9YFvqWlf8EvYBDVAgy7RLUw.HKV57OVAKpqOfG4Z.esjqXzOpXyzji3pKh9fido_nkZ9M7rtFiLx4jYoboCHXRunHEU6gOEYHaXkmfNkQK14Ud0iquGZzik1kd8w8_JYf5ZpizRPc8qVyX0zLKy-cUon7w5YYWGlaQ0m6YvSyVeHZQ8d0V6hOy4mkaRSmHSHjGK-WSQakjTiYr1YJBUkySaFUgQmaVjQQYuDHQyNV7gEeXDiOWIyJG9wSSYsuJojQqW5etTsmzfonuK0B5EKBzX9RoAlsLfjLGqm-g4qMm97q6Huv3qDgt5u0u2S3G6tnRoMReeFxfYv4ts0WbTxRDeKDhGfu74bTsU6wvty4r0lG1SLUNATTF3VQ5MZ2VjArpWh6qZNs8Gyqpd8p4YT74a-BZmCTqJ049JbHKg4vG6yoaWYYYEzVezuCqbQD8iOJFqepzd1lfqpow3o0oISQgPJXxbqQNhtTLj-AVvJVTGNEdWxIsT7pRmAJn9ft35_y52rSPSE6D4zfO3PeFPl1Ms9mgVN8VlRmEw0h4c92W60lk88r9Tz3ahSBKsdM6poE6ORFkHLC7uzdcFyJ6GtqeDgy1z1REP_Bs24NNWWYFfhgaqKkX7oGdP7mng5lHDrjEeKUyST4mrGME1ge55tTJL74YCLjTxSFaBaf9jl7hrNiJdcOSGvT805kMk5klUVn-nZscjv-OS78kmhgyYlt4yDJbe6rINsN2hgMgvxTZpcvruGKGblouzek5VVa1xBt0Fiw8h93LQ8bj_q49NntMzoG5m9T2iY8n0_0DGWH7ZJh39iEY2Y3JFVhKejm0vVQOjC-9yAAIsXsxuofHr-WXhSkuFeLTXDnxH4HeXK4K31N_Uio2rGpKmOJn9NTuxIUQ_Rg24I9YNGCeek6KIwLHg-VTWRV_Jk4vLDGd7z9skBTTG39Bm5L6Ceal96KEXCm_6ewNg-P76r8C-u5bEjgzR5P2sOn8Ty547MVZZuLdeT6BpHvNYFXr4zqOly3ANISijfAsUhSgxTQUI5JcHM2csdS-XpUvUdQViznHGqEI9Bbk5V0QC2xkK3NrW8__0wuxgNcZMbLAsUNNvSUli4JrvlTCF5uT3gip-AVb1TvOCwJAyGhgKlOxOr5ZtGUN1c1nRk01MklEdwdaPXVlVTdkYJIoI2OOHB4HajjA_gMMvxXe00wznNUqGZBozeHz0kJFzscdlVBMNq8zCe4KqYgkV9iw9xUWPazRqi7q4t9uu8jy3Yy3Il5IqJ9kHdq8nIIVX52i2owDPuhwW56P0bS2U1sQqn7RtlpZugPmvN35rnZ9K5NimswtJseZI_9PQ.5VkdwdH7ASOVSa4horXtTw; access-token=3230525.NxeZHmasHOHCs5Km9U6IidrorKpLwP2FxkP5lPvA; access-token-exp=2023-09-19T13:15:36.431Z; amp_8884d2=7gTuGDK0YI2zbO88w9b9o6...1hamlfdq2.1hamlsalu.0.0.0; amp_49323c=zlZvBDInh3h3JuMtuHmaxm.dW5kZWZpbmVk..1hamlf0e8.1hamlsaqe.2mj.0.2mj; AWSALB=iVZVmy2HeEQpjbN3PP7MvxhspVRie9sFG+9s5YjfKri6VsXoOCCHW1nsgXpQ1HChBXHNeBgWJPImE971Dy+J5/paFTDFnoiSjWwGjR6KBwxCavNiwDK66/UM3QFh; AWSALBCORS=iVZVmy2HeEQpjbN3PP7MvxhspVRie9sFG+9s5YjfKri6VsXoOCCHW1nsgXpQ1HChBXHNeBgWJPImE971Dy+J5/paFTDFnoiSjWwGjR6KBwxCavNiwDK66/UM3QFh';
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