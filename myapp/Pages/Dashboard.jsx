import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Font, Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink, Image } from '@react-pdf/renderer';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Link, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const menu = [
    {
        label: "Tüm Ürünler", name: "tumurunler"
    },
    {
        label: "Kategori Ekle", name: "kategoriekle"
    },
    {
        label: "Ürün Ekle", name: "urunekle"
    },
]

const Dashboard = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [posts, setPosts] = useState([]);
    // const [message, setMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [activePanel, setActivePanel] = useState("tumurunler")
    const [categoryName, setCategoryName] = useState('');
    const [productSearchText, setProductSearchText] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        console.log("selectedRows", selectedRows)
    }, [selectedRows])

    const router = useNavigate()

    const handleFileChange = (event) => {
        setImages(event.target.files);
    };

    const filteredItems = posts.filter(
        post => post.title && post.title.toLowerCase().includes(productSearchText.toLowerCase())
    );

    const columns = [
        {
            name: 'Title',
            selector: row => row.title,
            sortable: true,
            width: "40%"
        },
        {
            name: 'QR Code',
            cell: row => (
                <img width="70" src={`http://localhost/qrApp/api/${row.qr_code}`} alt="QR Code" />
            ),
            width: "30%"
        },
        {
            name: 'Details',
            cell: row => (
                <Button variant="primary" as={Link} to={`http://localhost:5173/product/${row.id}`}>
                    Detay
                </Button>
            ),
            width: "10%"
        },
        {
            name: 'Delete',
            cell: row => (
                <Button
                    variant="danger"
                    onClick={() => handleDeletePost(row.id)}
                >
                    Delete
                </Button>
            ),
            width: "10%"
        },
    ];

    const handleDownloadZip = async () => {
        try {
            const response = await axios.post('http://localhost/qrApp/api/download_zip.php', selectedRows, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'qrcodes.zip';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading zip file', error);
        }
    };

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#FFF',
            padding: 20,
            // fontFamily: 'Roboto'
        },
    });

    const MyDocument = ({ data }) => (
        <Document>
            <Page style={styles.page}>
                {data.map((item, index) => (
                    <View key={index} style={styles.section}>
                        <Image
                            src={"http://localhost/qrApp/api/" + item.qr_code}
                            allowDangerousPaths={true}
                        />
                        <Text>{item.title}</Text>
                    </View>
                ))}
            </Page>
        </Document>
    );

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category_id', selectedCategory);
        for (let i = 0; i < images.length; i++) {
            formData.append('images[]', images[i]);
        }

        try {
            const response = await axios.post('http://localhost/qrApp/api/upload.php', formData);
            fetchPosts()
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading the file:', error);
        }
    };

    const handleCategoryAdd = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost/qrApp/api/add_category.php', {
                name: categoryName
            });

            if (response.data.message) {
                // setMessage(response.data.message);
                setCategoryName('');
                getAllCategories()
            }
        } catch (error) {
            // setMessage('Error adding category');
            console.error('Error adding category:', error);
        }
    };

    const handleDeletePost = (id) => {
        axios.delete(`http://localhost/qrApp/api/delete_post.php`, {
            data: { id: id },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            const val = response.data;
            console.log("Response:", val);

            setPosts(posts.filter(post => post.id !== id));
            // if (val.success) {
            //     console.log("Post deleted successfully.");
            // } else {
            //     console.error("Error deleting the post:", val.message);
            // }
        })
        .catch(error => {
            console.error('There was an error deleting the post!', error);
        });
    };


    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost/qrApp/api/fetch_posts.php');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const getAllCategories = async () => {
        const response = await axios.get('http://localhost/qrApp/api/get_categories.php');
        setCategories(response.data);
    };

    useEffect(() => {
        fetchPosts();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await axios.get('http://localhost/qrApp/api/protected.php', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // setMessage(response.data.message);
            } catch (error) {
                router("/login")
                // setMessage('Access denied.');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router('/login');
        }
        getAllCategories();
    }, []);

    return (
        <Container fluid>
            <Row>
                <Col md={3} className="bg-black-50 vh-100">
                    <ul className="list-unstyled p-3">
                        {menu.map((item, index) => (
                            <li key={index} className="mb-2">
                                <Button variant="light" onClick={() => setActivePanel(item.name)} block>
                                    {item.label}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </Col>
                <Col md={9} className="vh-100 overflow-auto">
                    {activePanel === "tumurunler" && (
                        <div>
                            <h1 className="my-3">Tüm Ürünler</h1>
                            <button onClick={handleDownloadZip}>Download Selected as Zip</button>
                            <Form.Control
                                type="text"
                                placeholder="Search"
                                value={productSearchText}
                                onChange={e => setProductSearchText(e.target.value)}
                                className="mb-3"
                            />
                            <DataTable
                                columns={columns}
                                data={filteredItems}
                                pagination
                                selectableRows
                                onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
                            />
                        </div>
                    )}
                    {activePanel === "kategoriekle" && (
                        <div>
                            <h1 className="my-3">Add New Category</h1>
                            <Form onSubmit={handleCategoryAdd}>
                                <Form.Group controlId="categoryName">
                                    <Form.Label>Category Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button type="submit" className="mt-3">Add Category</Button>
                            </Form>
                        </div>
                    )}
                    {activePanel === "urunekle" && (
                        <div>
                            <h1 className="my-3">Upload</h1>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="title">
                                    <Form.Label>Title:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="category">
                                    <Form.Label>Category:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="description">
                                    <Form.Label>Description:</Form.Label>
                                    <ReactQuill value={description} onChange={setDescription} />
                                </Form.Group>
                                <Form.Group controlId="images">
                                    <Form.Label>Images:</Form.Label>
                                    <Form.Control
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        required
                                    />
                                </Form.Group>
                                <Button type="submit" className="mt-3">Upload</Button>
                            </Form>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;