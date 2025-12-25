import java.util.Scanner;

public class BookstoreApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Inventory inventory = new Inventory();
        inventory.loadInventory("inventory.dat"); // load saved inventory if exists

        while (true) {
            System.out.println("\n--- Mini Bookstore Menu ---");
            System.out.println("1. Add Book");
            System.out.println("2. View Books");
            System.out.println("3. Search Book");
            System.out.println("4. Sell Book");
            System.out.println("5. Save & Exit");
            System.out.print("Choose an option: ");
            int choice = sc.nextInt();
            sc.nextLine(); // consume newline

            switch (choice) {
                case 1:
                    System.out.print("Enter Book ID: ");
                    int id = sc.nextInt();
                    sc.nextLine();
                    System.out.print("Enter Title: ");
                    String title = sc.nextLine();
                    System.out.print("Enter Author: ");
                    String author = sc.nextLine();
                    System.out.print("Enter Price: ");
                    double price = sc.nextDouble();
                    System.out.print("Enter Quantity: ");
                    int qty = sc.nextInt();
                    sc.nextLine();
                    Book newBook = new Book(id, title, author, price, qty);
                    inventory.addBook(newBook);
                    break;

                case 2:
                    inventory.viewBooks();
                    break;

                case 3:
                    System.out.print("Enter keyword to search: ");
                    String keyword = sc.nextLine();
                    inventory.searchBook(keyword);
                    break;

                case 4:
                    System.out.print("Enter Book ID to sell: ");
                    int sellId = sc.nextInt();
                    System.out.print("Enter quantity: ");
                    int sellQty = sc.nextInt();
                    sc.nextLine();
                    inventory.sellBook(sellId, sellQty);
                    break;

                case 5:
                    inventory.saveInventory("inventory.dat");
                    System.out.println("Exiting... Bye!");
                    System.exit(0);

                default:
                    System.out.println("Invalid choice. Try again.");
            }
        }
    }
}
