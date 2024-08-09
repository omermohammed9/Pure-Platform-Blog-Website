$(document).ready(function () {
    // DOM Elements
    const $nameInput = $('#name');
    const $postInput = $('#post');
    const $validateDiv = $('#validate');
    const $darkModeToggle = $('#dark-mode-toggle');
    const $confirmModal = $('#confirmModal');
    const $confirmDeleteButton = $('#confirmDelete');
    const $cancelDeleteButton = $('#cancelDelete');
    const $spanClose = $('.close');
    const $publishButton = $('#publish');
    const $postsContainer = $('#posts');
    let postIdToDelete = null;
    let postIdToUpdate = null;
    let footerText;

    // Utility Functions
    function displayValidation(message) {
        $validateDiv.text(message).show();
        setTimeout(() => $validateDiv.hide(), 3000);
    }

    function showErrorModal(message) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,
            confirmButtonText: 'Close',
            confirmButtonColor: '#007bff'
        });
    }

    function simulateButtonClick(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            $publishButton.click();
        }
    }

    async function postExists(name, postContent) {
        try {
            const response = await fetch('http://localhost:3000/posts');
            const posts = await response.json();
            return posts.some(post => post.name === name && post.post === postContent);
        } catch (error) {
            console.error('Error checking existing posts:', error);
            return false;
        }
    }

    async function addPost() {
        const name = $nameInput.val().trim();
        const post = $postInput.val().trim();

        if (!name || !post) {
            displayValidation('Please enter both name and content.');
            return;
        }
        if (await postExists(name, post)) {
            showErrorModal('A similar post already exists.');
            $nameInput.val('');
            $postInput.val('');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/add/posts', {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify({name, post})
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            displayValidation('Post added successfully!');
            $nameInput.val('');
            $postInput.val('');
            await showPosts();
        } catch (error) {
            console.error('Error adding post:', error);
        }
    }

    function displayPosts(posts) {
        $postsContainer.empty();
        posts.forEach(post => {
            if (post.editedAt) {
                footerText = `Last edited: ${moment(post.editedAt).format('M/D/YYYY, h:mm A')}`;
            } else {
                footerText = `Posted on: ${moment(post.date).format('M/D/YYYY, h:mm A')}`;
            }
            $postsContainer.append(`
                <div class="card text-center" style="margin: 25px; transition: transform 0.3s;" data-id="${post.id}">
                    <div class="card-header" style="position: relative;">${post.name}
                    <button class="btn btn-danger btn-sm delete-btn" style="position: absolute; top: 10px; right: 10px;">&times;</button>
                     <button class="btn btn-info btn-sm update-btn" style="position: absolute; top: 10px; left: 10px;">&#9998;</button>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${post.post}</p>
                    </div>
                      <div class="card-footer text-body-secondary">${footerText}</div>
                </div>
            `);
        });

        $('.delete-btn').on('click', function () {
            postIdToDelete = $(this).closest('.card').data('id');
            $confirmModal.show();
        });

        $('.update-btn').on('click', function () {
            postIdToUpdate = $(this).closest('.card').data('id');
            const postContent = $(this).closest('.card').find('.card-text').text();
            showUpdateModal(postContent);
        });
    }

    async function showPosts() {
        try {
            const response = await fetch('http://localhost:3000/posts');
            let posts = await response.json();
            posts.reverse();
            displayPosts(posts);
        } catch (error) {
            console.error('Error showing posts:', error);
        }
    }

    async function showUpdateModal(postContent) {
        const { value: updatedContent } = await Swal.fire({
            title: 'Edit Post',
            input: 'textarea',
            inputValue: postContent,
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'Content cannot be empty!';
                }
            }
        });

        if (updatedContent) {
            if (updatedContent !== postContent) {
                try {
                    await updatePost(updatedContent);

                    //const editedAt = new Date().toLocaleString(); // Get local date and time for display
                    //const $postElement = $(`[data-id="${postIdToUpdate}"]`); // Select the post element using jQuery

                    // Update the post content in the UI using jQuery
                    //$postElement.find('.card-text').text(updatedContent);
                    //$postElement.find('.card-footer').text(`Last edited: ${editedAt}`);


                    await Swal.fire({
                        icon: 'success',
                        title: 'Post Updated',
                        text: 'The post has been successfully updated.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6'
                    });
                } catch (error) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `Failed to update the post: ${error.message}`,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#d33'
                    });
                }
            } else {
                await Swal.fire({
                    icon: 'info',
                    title: 'No Changes',
                    text: 'No changes were made to the post.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    }


    async function updatePost(updatedContent) {
        const editedAt = Date.now()
        if (!updatedContent) {
            showErrorModal('Content cannot be empty.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/update/${postIdToUpdate}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({post: updatedContent, editedAt})
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            await showPosts(); // Refresh posts after update
        } catch (error) {
            console.error('Error updating post:', error);
            showErrorModal(`Error updating post: ${error.message}`);
        }
    }

    async function deletePost(id) {
        try {
            const response = await fetch(`http://localhost:3000/delete/${id}`, {method: 'DELETE'});
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            await showPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }

    function toggleDarkMode() {
        $('body').toggleClass('dark-mode');
        const $icon = $('#dark-mode-toggle i');
        if ($('body').hasClass('dark-mode')) {
            $icon.removeClass('fa-moon').addClass('fa-sun');
        } else {
            $icon.removeClass('fa-sun').addClass('fa-moon');
        }
    }

    // Event Listeners
    $(window).on('load', showPosts);
    $darkModeToggle.on('click', toggleDarkMode);
    $publishButton.on('click', addPost);
    $nameInput.on('keypress', simulateButtonClick);
    $postInput.on('keypress', simulateButtonClick);

    $confirmDeleteButton.on('click', async () => {
        if (postIdToDelete) {
            await deletePost(postIdToDelete);
            postIdToDelete = null;
            $confirmModal.hide();
            await showPosts();
        }
    });

    $cancelDeleteButton.on('click', () => {
        $confirmModal.hide();
        postIdToDelete = null;
    });

    $spanClose.on('click', () => {
        $confirmModal.hide();
        postIdToDelete = null;
    });
});
