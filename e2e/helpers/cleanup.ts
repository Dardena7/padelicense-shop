import { execSync } from "child_process";

const API_DIR = "../padelicense-api";

export const cleanupTestData = () => {
  execSync(
    `docker compose exec -T api rails runner "
      User.where('email LIKE ?', '%@e2e-test.com').each do |u|
        LineItem.where(order_id: u.orders.select(:id)).delete_all
        u.orders.delete_all
        u.addresses.delete_all
        u.cart&.items&.delete_all
        u.cart&.delete
        u.refresh_tokens.delete_all
        u.delete
      end

      Cart.where(guest_uuid: Cart.left_joins(:items).where(cart_items: { id: nil }).select(:guest_uuid)).where(user_id: nil).delete_all
    "`,
    { cwd: API_DIR, stdio: "pipe" },
  );
};
