import {Box, Button, Card, CardBody, Flex, Heading, Input, InputLeftElement,InputGroup,  Stack} from "@chakra-ui/react";
import { FaUserCheck } from "react-icons/fa";//ユーザーアイコンのインポート
import { RiLockPasswordFill } from "react-icons/ri";//パスワードアイコンのインポート
import  useFirebase  from "../hooks/useFirebase.jsx";//firebaseのフックをインポート

const Login = () => {
    const { loading, email, setEmail, password, setPassword, handleLogin } = useFirebase()
    return (
        <Flex justifyContent="center" boxSize="fit-content" mx="auto" p={5}>
            <Card size={{base :"sm",md:"lg"}} p={4}>
                <Heading siza="md" textAlign="center">Login</Heading>
                <CardBody>
                    <form onSubmit={handleLogin}>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <FaUserCheck color="gray" />
                            </InputLeftElement>
                            <Input 
                                autoFocus
                                type="email"
                                placeholder="メールアドレスを入力"
                                name="email"
                                mb={2}
                                onChange={(e) => {setEmail(e.target.value)}}
                                required
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <RiLockPasswordFill color="gray" />
                            </InputLeftElement>
                            <Input 
                                type="password"
                                placeholder="パスワードを入力"
                                name="password"
                                mb={2}
                                onChange={(e) => {setPassword(e.target.value)}}
                                required    
                            />
                        </InputGroup>
                        <Box mt={4} mb={2}textAlign="center">
                            <Button
                                //isLoading={loading}
                                loadingText="Loading"
                                spinnerPlacement="start"
                                type="submit" colorScheme="green" width="100%"mb={2}>ログイン
                            </Button>
                            <Button colorScheme="green" width="100%" variant="outline" onClick={() => {}}>
                                新規登録
                            </Button>   
                        </Box>
                        <Box mt={4} mb={2} textAlign="center">
                            <Stack spacing={3}>
                                <Button 
                                    colorScheme="green"
                                    width="100%"
                                    variant="ghost"
                                    onClick={() => {}}>
                                        パスワードをお忘れですか？
                                    </Button>
                            </Stack>
                        </Box>

                    </form>
                </CardBody>
            </Card>
            <h1>Login</h1> 
        </Flex>
    );
};

export default Login;
