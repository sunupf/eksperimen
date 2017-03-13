require "selenium-webdriver"

class Test
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    # Here some example
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element(:css => '#todo-list').displayed? }

    url = @testCase['testCases']['target']
    id = url.split("/").last


    action = @driver.action
    begin
      element = @driver.find_element :css => "#todo-list li#todo-#{id}"
      delete = @driver.find_element :css => "#todo-list li#todo-#{id} .delete"
    rescue
      element = @driver.find_element :css => "#todo-list li:last-child"
      delete = @driver.find_element :css => "#todo-list li:last-child .delete"
      puts element.text
      @driver.execute_script("arguments[0].setAttribute('data-target','#{url}')" , delete)
      id = delete.attribute("id")
      puts element.text
    end
    # @driver.execute_script("arguments[0].click()" , delete)

    action.move_to(element).move_to(delete).click().perform()

    wait.until { @driver.find_element(:css => '.showSweetAlert.visible, .uk-alert.uk-alert-danger p').displayed? }

    confirm = @testCase['testCases']['confirm'];

    if(confirm.to_i === 0)
      cancel = @driver.find_element :css => ".showSweetAlert.visible .cancel"
      puts cancel.text
      cancel.click
      begin
        return element.displayed?
      rescue
        return false
      end
    elsif (confirm.to_i > 0)
      expected = @testCase['messages']
      not_found = @driver.find_elements :css => '.uk-alert.uk-alert-danger p'
      result = Array.new

      if(!not_found.empty?)
        result.push not_found[0].text
      else
        yes = @driver.find_element :css => ".showSweetAlert.visible .confirm"
        yes.click

        wait.until { @driver.find_element(:css => '.showSweetAlert.visible h2, .uk-alert.uk-alert-danger p') }
        respons = @driver.find_elements :css => '.showSweetAlert.visible h2, .uk-alert.uk-alert-danger p'

        respons.each do |respon|
          result.push respon.text
        end
      end

      puts "expected : #{expected}"
      puts "////"
      puts "respons : #{result}"
      return result === expected
      # return true
    end
  end
end
