import { Box, Button, Card, CardBody, Flex, Heading, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const Home = () => {
    return (
        <>
            <Flex alignItems='center' justify='center' p={5}>
                <Card size={{ base: 'sm', md: 'lg' }}>
                    <Box textAlign='center' mb={2} mt={10}>
                        ようこそ！ test@test.com さん
                    </Box>
                    <Heading size='md' textAlign='center'>Learning Records</Heading>
                    <CardBody>
                        <Box textAlign='center'>
                            学習記録
                            <TableContainer>
                                <Table variant='simple' size={{ base: 'sm', md: 'lg' }}>
                                    <Thead>
                                        <Tr>
                                            <Th>学習内容</Th>
                                            <Th>時間(分)</Th>
                                            <Th></Th>
                                            <Th></Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td>React</Td>
                                            <Td>10</Td>
                                            <Td>
                                                <Button variant='ghost'><FiEdit color='black' /></Button>
                                            </Td>
                                            <Td>
                                                <Button variant='ghost'><MdDelete color='black' /></Button>
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box p={5}>
                            <div>合計学習時間：10分</div>
                        </Box>

                        <Box p={25}>
                            <Stack spacing={3}>
                                <Button
                                    colorScheme='green'
                                    variant='outline'
                                    onClick={() => { }}
                                >新規データ登録
                                </Button>
                            </Stack>
                        </Box>
                        <Box px={25} mb={4}>
                            <Stack spacing={3}>
                                <Button
                                    width='100%'
                                    variant='outline'
                                    onClick={() => { }}
                                >ログアウト</Button>
                            </Stack>
                        </Box>
                        <Box px={25} mb={4}>
                            <Stack spacing={3}>
                                <Button
                                    width='100%'
                                    variant='outline'
                                    onClick={() => { }}
                                >パスワード更新</Button>
                            </Stack>
                        </Box>
                    </CardBody>
                </Card>
            </Flex>
        </>
    )
}
export default Home;