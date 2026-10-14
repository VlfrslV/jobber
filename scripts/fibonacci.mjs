const AUTH_API_URL = 'http://localhost:3000/graphql';
const JOBS_API_URL = 'http://localhost:3001/graphql';

const LOGIN_MUTATION = `
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      id
    }
  }
`;

const LOGIN_VARIABLES = {
  loginInput: {
    email: 'a2@b.com',
    password: 'Strong!Pass1',
  },
};

const EXECUTE_JOB_MUTATION = `
  mutation ExecuteJob($executeJobInput: ExecuteJobInput!) {
    executeJob(executeJobInput: $executeJobInput) {
      name
      description
    }
  }
`;

async function login() {
  const result = await fetch(AUTH_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: LOGIN_MUTATION,
      variables: LOGIN_VARIABLES,
    }),
  });
  const data = await result.json();
  const setCookie = result.headers.getSetCookie?.() ?? [];
  const cookie =
    setCookie.find((value) => value.startsWith('Authentication=')) ??
    result.headers.get('Set-Cookie');
  return { data, cookie };
}

async function executeJob(executeJobInput, cookie) {
  const result = await fetch(JOBS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
    },
    body: JSON.stringify({
      query: EXECUTE_JOB_MUTATION,
      variables: { executeJobInput },
    }),
  });
  return result.json();
}

(async () => {
  const { data, cookie } = await login();
  console.log(data);

  if (!cookie) {
    console.error('No Authentication cookie from login');
    process.exit(1);
  }

  try {
    const n = 1000;
    const executeJobInput = {
      name: 'fibonacci',
      data: Array.from({ length: n }, (_, i) => ({
        iterations: i + 1,
      })),
    };
    const result = await executeJob(executeJobInput, cookie);
    console.log(result);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
