module bikers::collection {
    use std::string::{Self, String};
    use std::signer;
    use std::vector;
    use std::option;

    use aptos_framework::aptos_account;
    use aptos_framework::object::{Self, ExtendRef};
    
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    
    const MODULE_DATA_SEED: vector<u8> = b"MODULE_DATA";

    const COLLECTION_NAME: vector<u8> = b"Bikers";
    const COLLECTION_DESC: vector<u8> = b"Bikers on Aptos";
    const COLLECTION_URI: vector<u8> = b"https://bikers.jurenka.software/0.jpeg";
    
    const MAX_MINT_N: u64 = 20;
 
    const EMINTED_OUT: u64 = 0;
 
    struct ModuleData has key {
        collection_name: String,
        fee_receiver: address,
        extend_ref: ExtendRef,
        mint_n: u64
    }
    
    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Witch has key {
        mutator_ref: token::MutatorRef,
    }
    
    fun init_module(deployer: &signer) {
        let collection_name = string::utf8(COLLECTION_NAME);
        
        let ctor_ref = object::create_named_object(deployer, MODULE_DATA_SEED);

        let module_data = ModuleData {
            collection_name,
            fee_receiver: signer::address_of(deployer),
            extend_ref: object::generate_extend_ref(&ctor_ref),
            mint_n: 0
        };

        collection::create_unlimited_collection(
            &object::generate_signer(&ctor_ref),
            string::utf8(COLLECTION_DESC),
            collection_name,
            option::none(),
            string::utf8(COLLECTION_URI),
        );

        move_to(deployer, module_data);
    }

    // Cost 0.1 APT to mint
    public entry fun mint_witch(
        minter: &signer,
    ) acquires ModuleData {
        let module_data = borrow_global_mut<ModuleData>(@bikers);
        let collection_signer = object::generate_signer_for_extending(&module_data.extend_ref);
        
        assert!(module_data.mint_n <= MAX_MINT_N, EMINTED_OUT);
        
        aptos_account::transfer(minter, module_data.fee_receiver, 010_000_000);

        let name = string::utf8(b"Bikers #");
        name.append_utf8(u64_to_string_vector(module_data.mint_n));
        
        let img_uri = string::utf8(b"https://bikers.jurenka.software/");
        img_uri.append_utf8(u64_to_string_vector(module_data.mint_n));
        img_uri.append_utf8(b".jpeg");

        let token_ref = token::create_named_token(
            &collection_signer,
            string::utf8(COLLECTION_NAME),
            string::utf8(COLLECTION_DESC),
            name,
            option::none(),
            img_uri
        );
        
        module_data.mint_n += 1;

        object::transfer_call(
            &collection_signer,
            object::address_from_constructor_ref(&token_ref),
            signer::address_of(minter)
        );
    }

    fun u64_to_string_vector(num: u64): vector<u8> {
        if (num == 0) {
            return b"0";
        };

        let digits = vector::empty<u8>();
        let temp = num;

        while (temp > 0) {
            let digit = (temp % 10) as u8;
            vector::push_back(&mut digits, digit + 48); // Convert digit to ASCII character
            temp = temp / 10
        };

        vector::reverse(&mut digits);

        digits
    }
    
    #[test]
    public fun test_u64_to_string() {
        use std::debug;
        let zero = u64_to_string_vector(0);
        let one = u64_to_string_vector(1);
        let ten = u64_to_string_vector(10);
        let big_number = u64_to_string_vector(1234567890);

        debug::print(&zero);
        debug::print(&one);
        debug::print(&ten);
        debug::print(&big_number);

        assert!(b"0" == zero, 0);
        assert!(b"1" == one, 1);
        assert!(b"10" == ten, 10);
        assert!(b"1234567890" == big_number, 1234567890);
    }
 
}
