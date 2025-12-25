import java.util.*;
import java.io.*;

public class Inventory {
    private ArrayList<Book> books;

    public Inventory() {
        books = new ArrayList<>();
    }

    // Add book
    public void addBook(Book book) {
        books.add(book);
        System.out.println("Book added successfully!");
    }

    // View all books
    public void viewBooks() {
        if (books.isEmpty()) {
            System.out.println("No books in inventory.");
            return;
        }
        for (Book b : books) {
            System.out.println(b);
        }
    }

    // Search by title or author
    public void searchBook(String keyword) {
        boolean found = false;
        for (Book b : books) {
            if (b.getTitle().toLowerCase().contains(keyword.toLowerCase()) ||
                    b.getAuthor().toLowerCase().contains(keyword.toLowerCase())) {
                System.out.println(b);
                found = true;
            }
        }
        if (!found) {
            System.out.println("No book found with that keyword.");
        }
    }

    // Update quantity (simulate selling a book)
    public void sellBook(int id, int quantity) {
        for (Book b : books) {
            if (b.getId() == id) {
                if (b.getQuantity() >= quantity) {
                    b.setQuantity(b.getQuantity() - quantity);
                    System.out.println("Sold " + quantity + " copy/copies of " + b.getTitle());
                } else {
                    System.out.println("Not enough stock to sell.");
                }
                return;
            }
        }
        System.out.println("Book ID not found.");
    }

    // Save inventory to file
    public void saveInventory(String filename) {
        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(filename))) {
            out.writeObject(books);
            System.out.println("Inventory saved to " + filename);
        } catch (IOException e) {
            System.out.println("Error saving inventory: " + e.getMessage());
        }
    }

    // Load inventory from file
    public void loadInventory(String filename) {
        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream(filename))) {
            books = (ArrayList<Book>) in.readObject();
            System.out.println("Inventory loaded from " + filename);
        } catch (FileNotFoundException e) {
            System.out.println("No saved inventory found. Starting fresh.");
        } catch (IOException | ClassNotFoundException e) {
            System.out.println("Error loading inventory: " + e.getMessage());
        }
    }
}
